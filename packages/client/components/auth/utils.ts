export const setAccessToken = (accessToken: string) => {
    // TODO: Save token in memory instead once OAuth 2.0 is implemented
    localStorage.setItem('accessToken', accessToken)
}

export const getAccessToken = () => {
    return localStorage.getItem('accessToken')
}
