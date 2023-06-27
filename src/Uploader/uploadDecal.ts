const URL = "https://apis.roblox.com/assets/user-auth/v1/create";

export default async function uploadDecal(robloSecurity: string, name: string, file: File) {
    let data = new FormData();

    data.append("fileContent", file);
    data.append("request", JSON.stringify({
        "targetType":"Decal",
        "creationContext": {
            "assetName": name,
            "assetDescription":"Decal",
            "creator": {
                "creatorType": "User",
                "creatorId":100992104
            },
            "expectedPrice":0
        }
    }))

    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Cookie": `.ROBLOSECURITY=${robloSecurity}`
        },
        body: data
    });

    const json = await response.json();
    console.log(json);
}

"GuestData=UserID=-1664718940; RBXEventTrackerV2=CreateDate=8/12/2021 12:06:33 AM&rbxid=99639172&browserid=114603213570; .RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5NTA2ODM3OC03MzMyLTQ4YTMtYWQ1Zi1mZDg3ODdmYjY1M2QiLCJzdWIiOjEwNzU1OTE4fQ.ap2bzuOnNLaI4vIbyOpUspUmthZ6FST0RZ1U-PuaqPs; .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_64840B981417111598078FA1FAE8AEF87487AF2F748E0861CA99ECE9778779AA4FD5D2CCF9AA9FBF6D0CAD60C91287D297E3596ADD5BF24691BCE8593D431EBB070C8268ED4BE04B151C83CF0E9E4B7CBDE8D1377AFA184858267418B0D3A820A45C419B6088E36FC189255862904889A66479C1CEBE924C8727E6D2F869E434526D37F1F270AF37345352F38575E8742AB59EC5FE87CAE12F056F4F8568C039184F6F54817937A79DD3455A645F8892B859F1DDC74485CC0805F55E35F103B66F8EF147A0DD2F344ED646E2EF58BED5202C68470EA10B1C4EDBB274B2A253967EAC962C329461152736431F0AB025CC483EA3C1FE68FD288FFA4D0093517C3F4D401F324DDC3C0F14AED37C766963BA9D74050E5B1598047649BDB022219B772FE5487A1586CC4DE306765B9C1FE5703F56D0C9431BA09FB1ECF1734D2B8B87C095EAE3FA9229836B0956572A0E3F67F063A9BDA0A778D56F1D66625C9D864EB64639AB; RBXSource=rbx_acquisition_time=6/18/2023 11:51:57 AM&rbx_acquisition_referrer=https://www.roblox.com/groups/3072065/Spaces-are-better-than-tabs&rbx_medium=Direct&rbx_source=www.roblox.com&rbx_campaign=&rbx_adgroup=&rbx_keyword=&rbx_matchtype=&rbx_send_info=1; rbx-ip2=; RBXSessionTracker=sessionid=a5464f87-2229-416d-a85d-ba8131500147; ak_bmsc=B1267DC6A471A37F12256999E758A4B3~000000000000000000000000000000~YAAQ3OkyFyr0sN6IAQAACQtL9RTWaqtQpiwzx6Brv4MrMqaOqQVI3EIoYnqNkU9P1Ikrl7H7coUGfrQpJYQltNyu0dcGSAyHa5mGHrGFYjYKBFF+eg5m3LeU578xsxDPGTkIXW3dFi07rJUc5J7iJjs+VoYreNAPPOY+5Ah8pNDZlh46WKNIPJkF570pSIn6DF4XuOntcb3THYbprUkpkHk/k/aje6BPsoMv6cilMJUOk7VtsQm7y6NdMcqwc8WCdicTbiXnVgwH8zwUsKScRPyQOkt3aw9kA7gOxOu7qj0FXkkadixFWHOTKo4sFimIm9GKPdejEulhZY+dtxBtmnUoAnpHBpIublVms/00rEdvXsSh+BmKDKnbIzIjt6BXrxrwungObTbpKJ1s2sSFY21ESbnvI9hhfWn19W8Ubx6Cfqac; bm_mi=E2C758A5B9B6DC812A4B6B532D631915~YAAQ3OkyF8H1sN6IAQAAgzJM9RSh2HFB0iJdLIm100T3ZMaXCaNAlTSATuZ3XVKjYL/klXlcQ6GXFvMn9MfNOgk1OGAmASLuQrv6w7Vwtq0OrJ9IetYdZDacmH+1aNFbDEWYIfNZS/DS4JWgaEUjWnkiBcHW1+KPXibZoGVb0kYBsruR0JOSteJTyJQu863FRwwSc/9KUfmFTX7jp9QHNDsfLj9zqJXYKA4mBBgt04GypkMBQpYjB92JOb8v681NKG3hVEDTIByqhD7HyS8IwfDD7TkoVN10OFC2nZzhjHAMh3oBqRmBcGOR9ccFWtfD+tBcs2kGlQU7eF09qmbt0H6TxGKu/JqE/SQf3sEvsCYQjXEyQQzzsvSUQA==~1; bm_sv=3DB1A4150E2DDC75373A52D62CB27F31~YAAQ3OkyF4r3sN6IAQAAR/RO9RTtdiSyn06GI/Xp1m4IryiAf+7uKlblT7/GS0Rsia31fxl9ySN4YB8Pcxu4gGFXO+SVDl4j0384loYXpwJyklA/snHQialGJbGsvXXnq1zVCFks6v+DTRYp6aKsFmqSdX2EGtyP6FJU4EtX2fTcbJn7pfLyXc4Jm4jWsspilFcYx0wDvqeNzMCDbI2LJprqZ4GvUgm6CWOZA4dRU2B9xLbGtAWRX+iM/8J3yAHAww==~1"