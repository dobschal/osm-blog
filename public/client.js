import {Chart, registerables} from 'https://cdn.jsdelivr.net/npm/chart.js@4.5.0/+esm'

Chart.register(...registerables);

const COLORS = [
    "brown", // Red-Orange
    "green", // Green
    "blue", // Blue
    "pink", // Pink
    "purple", // Purple
    "gray", // Yellow
    "cyan", // Cyan
    "orange", // Orange
    "violet", // Violet
    "lightgreen", // Light Green
    "red", // Red
    "darkblue",  // Dark Blue
    "greenyellow", // Green-Yellow
];
const weekNrInput = document.getElementById("week_nr")
weekNrInput.addEventListener("change", async (event) => {
    weekNrInput.parentElement.submit();
});

console.log("Teams: ", TEAMS);
console.log("Matches: ", MATCHES);

const match = MATCHES.find(match => match.weekNr === WEEK_NUMBER && match.matchType === 0);
if(!match?.matchData) {
    alert("Der ausgewählte Spieltag wurde noch nicht gespielt.");
}

const datasets = TEAMS.filter(team => !!team.userId).map((team, index) => {
    const data = [];
    for(let weekNumber= 0; weekNumber <= WEEK_NUMBER; weekNumber++) {
        const standing = calculateStanding(MATCHES, weekNumber, TEAMS);
        const position = standing.findIndex(standing => Number(standing.teamId) === team.id);
        if(position !== -1) {
            data.push(position + 1);
        }
    }
    return {
        label: team.name,
        data: data,
        tension: 0.2,
        radius: 0,
        borderColor: COLORS[index % COLORS.length],
    }
});

new Chart(document.getElementById('performance-chart'), {
    type: 'line',
    data: {
        datasets,
        labels: datasets[0].data.map((_, index) => `Spieltag ${index + 1}`)
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                reverse: true, // Reverse the y-axis to have 1st place at the top
                ticks: {
                    callback(val) {
                        if(val === 0) {
                            return "";
                        }
                        return `${val}.`;
                    },
                    stepSize: 1,
                }
            }
        }
    }
});

function calculateStanding(matches, weekNr, teams) {
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
