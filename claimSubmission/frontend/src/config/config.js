export const dialogFlowSettings = {
    defaultIntent: 'WELCOME',
    title: 'ClaimBot',
    agentId: window.DIALOGFLOW_AGENT_ID || 'ce617fac-032a-442b-8976-36b110b58133'
}

export const httpApiSettings = {
    host: window.API_HOST || 'http://' + window.location.hostname +':5000'
}