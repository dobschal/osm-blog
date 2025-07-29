/**
 * @param {Array<GameResult>} matches
 * @param {number} weekNr
 * @param {Array<{name: string, id: number}>} teams
 */
export function calculateStanding(matches, weekNr, teams) {
    const standing = {};

    const relevantMatches = matches
        .filter(match => match.weekNr <= weekNr && match.matchType === 0);
    relevantMatches.forEach(match => {

            const homeTeamId = match.homeTeamId;
            const awayTeamId = match.awayTeamId;

            if (!standing[homeTeamId]) {
                standing[homeTeamId] = { points: 0, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0, name: teams.find(team => team.id === homeTeamId)?.name || "Unknown Team" };
            }
            if (!standing[awayTeamId]) {
                standing[awayTeamId] = { points: 0, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0, name: teams.find(team => team.id === awayTeamId)?.name || "Unknown Team" };
            }

            standing[homeTeamId].goalsFor += match.homeGoals;
            standing[homeTeamId].goalsAgainst += match.awayGoals;
            standing[awayTeamId].goalsFor += match.awayGoals;
            standing[awayTeamId].goalsAgainst += match.homeGoals;

            standing[homeTeamId].matchesPlayed++;
            standing[awayTeamId].matchesPlayed++;

            if (match.homeGoals > match.awayGoals) {
                standing[homeTeamId].points += 3; // Home team wins
            } else if (match.homeGoals < match.awayGoals) {
                standing[awayTeamId].points += 3; // Away team wins
            } else {
                standing[homeTeamId].points += 1; // Draw
                standing[awayTeamId].points += 1;
            }
        });

    return Object.entries(standing)
        .map(([teamId, stats]) => ({
            teamId,
            ...stats
        }))
        .sort((a, b) => b.points - a.points || b.goalsFor - a.goalsFor || a.goalsAgainst - b.goalsAgainst);
}
