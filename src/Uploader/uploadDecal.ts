import { get, writable, type Writable } from "svelte/store";
import {
  getUserID,
  refresh,
  refreshAccessToken,
  token,
  type ResponseType,
} from "./authentication";

type AssetStatus =
  | "Waiting"
  | "Queued"
  | "Uploading"
  | "Processing"
  | "Completed"
  | "Rejected"
  | "Error";

interface QueuedAsset {
  name: string;
  file: File;
  status: AssetStatus;
  assetId: number | null;
  operationId?: string;
  error?: string;
}

export const uploadQueue = writable<Array<QueuedAsset>>([]);

interface Asset {
  assetType: string;
  assetId: number;
  creationContext: {
    creator: {
      userId: number;
      groupId: number;
    };
  };
  description: string;
  displayName: string;
  path: string;
  revisionId: string;
  revisionCreateTime: string;
  moderationResult: {
    moderationState: string;
  };
  icon: string;
  previews: Array<{
    asset: string;
    altText: string;
  }>;
  state: string;
  socialLink: {
    title: string;
    uri: string;
  };
}

interface UploadResponse {
  path: string;
  operationId: string;
  done: boolean;
}

export default async function uploadDecal(
  name: string,
  file: File
): Promise<ResponseType<UploadResponse>> {
  const URL = "https://apis.roblox.com/assets/v1/assets";
  const t = get(token);
  if (t === null) {
    return { success: false, error: "Not authenticated" };
  }
  const userID = await getUserID();
  let data = new FormData();

  data.append("fileContent", file);
  data.append(
    "request",
    JSON.stringify({
      assetType: "Decal",
      displayName: name,
      description: "Decal",
      creationContext: {
        creator: {
          userId: userID,
        },
        expectedPrice: 0,
      },
    })
  );

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${t}`,
    },
    body: data,
  });

  const json = await response.json();

  if (response.ok) {
    return { success: true, result: json as UploadResponse };
  } else {
    if (response.status === 401) {
      // revalidate token
      if (!(await refreshAccessToken())) {
        return { success: false, error: "Not authenticated" };
      } else {
        return await uploadDecal(name, file);
      }
    }
    console.log(json);
    return { success: false, error: json.message || "Unknown error" };
  }
}

export async function runQueue(callback?: () => void) {
  let queue = get(uploadQueue).filter((item) => item.status === "Waiting");
  for (let asset of queue) {
    asset.status = "Queued";
  }
  uploadQueue.set(get(uploadQueue));
  let employRateLimiting = queue.length > 50;
  // upload each asset in the queue
  for (let asset of queue) {
    let start = performance.now();
    asset.status = "Uploading";
    uploadQueue.set(get(uploadQueue));
    const result = await uploadDecal(asset.name, asset.file);
    if (result.success) {
      asset.operationId = result.result.operationId;
      asset.status = "Processing";
    } else {
      asset.status = "Error";
      asset.error = result.error || "Unknown error";
    }
    if (employRateLimiting) {
      let elapsed = performance.now() - start;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }
    }
    uploadQueue.set(get(uploadQueue));
    if (callback) callback();
  }

  // poll for status
  queue = queue.filter((item) => item.status === "Processing");
  while (queue.length > 0) {
    let ids = queue.map((item) => item.operationId).filter((id) => id !== null);
    for (let id of ids) {
      const start = performance.now();
      const status = await getDecalStatus(id);
      if (status.success) {
        const asset = queue.find((item) => item.operationId === id);
        if (asset) {
          if (status.result.done) {
            if (
              status.result.error ||
              status.result.response?.moderationResult?.moderationState !==
                "Approved"
            ) {
              asset.status = "Error";
              asset.error = status.result.error || "Unknown error";
            } else {
              asset.status = "Completed";
              asset.name = status.result.response.displayName;
              asset.assetId = status.result.response.assetId;
            }
            queue = queue.filter((item) => item.operationId !== id);
            uploadQueue.set(get(uploadQueue));
            if (callback) callback();
          }
        }
      } else {
        const asset = queue.find((item) => item.operationId === id);
        if (asset) {
          asset.status = "Error";
          asset.error = status.error || "Unknown error";
          queue = queue.filter((item) => item.operationId !== id);
          uploadQueue.set(get(uploadQueue));
          if (callback) callback();
        }
      }
      if (employRateLimiting) {
        let elapsed = performance.now() - start;
        if (elapsed < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  if (callback) callback();
}

interface OperationStatus {
  path: string;
  done: boolean;
  error: any;
  response: any;
}

export async function getDecalStatus(
  operationId: string
): Promise<ResponseType<OperationStatus>> {
  const URL = `https://apis.roblox.com/assets/v1/operations/${operationId}`;
  const t = get(token);
  if (t === null) {
    return { success: false, error: "Not authenticated" };
  }

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${t}`,
    },
  });

  const json = await response.json();

  console.log(json);
  if (response.ok) {
    return { success: true, result: json as OperationStatus };
  } else {
    if (response.status === 401) {
      // revalidate token
      if (!(await refreshAccessToken())) {
        return { success: false, error: "Not authenticated" };
      } else {
        return await getDecalStatus(operationId);
      }
    }
    console.log(json);
    return { success: false, error: json.message || "Unknown error" };
  }
}

export async function getDecal(id: number): Promise<ResponseType<Asset>> {
  const URL = `https://apis.roblox.com/assets/v1/assets/${id}`;
  const t = get(token);
  if (t === null) {
    return { success: false, error: "Not authenticated" };
  }

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${t}`,
    },
  });

  const json = await response.json();

  if (response.ok) {
    return { success: true, result: json as Asset };
  } else {
    console.log(json);
    return { success: false, error: json.message || "Unknown error" };
  }
}

export function dataURLtoFile(url, name) {
  const arr = url.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, { type: mime });
}
