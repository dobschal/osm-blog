
/**
 * @typedef {object} GameResult
 * @property {string} id - Unique identifier for the game result, formatted as "leagueId_matchId_weekNr".
 * @property {number} leagueId - The ID of the league in which the match was played.
 * @property {number} weekNr - The week number of the match within the league's season.
 * @property {number} matchId - The ID of the match.
 * @property {number} homeTeamId - The ID of the home team.
 * @property {number} awayTeamId - The ID of the away team.
 * @property {number} homeGoals - The number of goals scored by the home team.
 * @property {number} awayGoals - The number of goals scored by the away team.
 * @property {number} matchType - The type of the match (e.g., regular season, cup match).
 * @property {number} refereeId - The ID of the referee officiating the match.
 * @property {number} winnerTeamId - The ID of the team that won the match (0 if no winner).
 * @property {number} legType - The type of leg for the match (e.g., first leg, second leg).
 * @property {boolean} isDecidedByPenalties - Indicates if the match was decided by penalties.
 * @property {boolean} isPlayedOnNeutralGround - Indicates if the match was played on neutral ground.
 * @property {boolean} isExtraTimePlayed - Indicates if extra time was played in the match.
 */

const leagueId = "118223162";
const auth = {
    token: "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPU00uQXV0aGVudGljYXRpb24iLCJleHAiOjE3NTM3MDgxMDksIm5iZiI6MTc1MzcwNjkwOSwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI5NTQwOTg4MzYiLCJzdWIiOjk1NDA5ODgzNiwid29ybGQiOjEsInRlYW0iOlsiMTE4MjIzMTYyLDE1IiwiMTQ0MTM2NzQ2LDE3Il0sImlhdCI6MTc1MzcwNjkwOX0.reFXJct2YGdQyV9lnrTcaXuhK9H_HZTnfRA03CEQgK0",
    refreshToken: "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPU00uQXV0aGVudGljYXRpb24iLCJleHAiOjE3NTQzMTE3MDksIm5iZiI6MTc1Mjg3MDk4MSwiaWQiOjc3OTY1NDcwOCwidG9rZW4iOiI0MGE0OWJmOS05ZjU1LTQwNzctODE4OS1lMzQzMzZjZjI4MDIiLCJpYXQiOjE3NTM3MDY5MDl9.kL5rJ170KQsco_bbypyTnUsKa9ZB5o1D1Eqfhf6bvLg",
    client_secret: "ePOVDMfAvU8zcyfaxLMtqYSmND3n6vmmKx9ZlVnNGjGkzucMCt",
    client_id: "jPs3vVbg4uYnxGoyunSiNf1nIqUJmSFnpqJSVgWrJleu6Ak7Ga",
    lastTokenRefresh: 0
};

export async function getLeague() {
    return await requestOsm("");
}

export async function getMatches() {
    return (await requestOsm("/matches/filter?type=0")).filter(match => !!match.matchData);
}

export async function getTeams() {
    return await requestOsm("/teams");
}

async function requestOsm(path) {
    await refreshToken();
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json; charset=utf-8");
    myHeaders.append("accept-language", "en-GB, en-GB");
    myHeaders.append("appversion", "3.231.0");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("platformid", "14");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("sec-ch-ua", "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36");
    myHeaders.append("Authorization", `Bearer ${auth.token}`);
    // myHeaders.append("Cookie", "__cf_bm=kw43rucdnOjL54a1332ZaUyb4Mk59FzZHtA4yPGFav8-1753706481-1.0.1.1-7Vq5aihrc6PjH_.kBE.CXhEzsNB.b67HRaDE5lpxTHmape1diD.xVzzL8BWdZy2f4Kke6p7aggszI4AZ_WvQen1ndPuVZc7g5KYVzv684ok");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const rawResponse = await fetch(`https://web-api.onlinesoccermanager.com/api/v1/leagues/${leagueId}${path}`, requestOptions);

    return await rawResponse.json();
}

async function refreshToken() {
    if(Date.now() - auth.lastTokenRefresh < 1000 * 60) {
        console.log("Token refresh skipped, still valid.");
        return;
    }
    console.log("Refreshing token...");
    auth.lastTokenRefresh = Date.now();
    const formData = new FormData();
    formData.append("grant_type", "refresh_token");
    formData.append("client_id", auth.client_id);
    formData.append("client_secret", auth.client_secret);
    formData.append("refresh_token", auth.refreshToken);
    const rawResponse = await fetch("https://web-api.onlinesoccermanager.com/api/tokenRefresh", {
        "headers": {
            "accept": "application/json; charset=utf-8",
            "accept-language": "en-GB, en-GB",
            "appversion": "3.231.0",
            "authorization": "Bearer " + auth.token,
            "platformid": "14",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://en.onlinesoccermanager.com/"
        },
        "body": formData,
        "method": "POST"
    });
    /**
     * @type {Object}
     * @property {string} access_token
     * @property {string} token_type
     * @property {number} expires_in
     * @property {string} refresh_token
     */
    const response = await rawResponse.json();
    auth.token = response.access_token;
    auth.refreshToken = response.refresh_token;
    console.log("New token:", auth.token);
}
