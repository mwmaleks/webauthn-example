export const MATCH_MEDIA = '@MATCH_MEDIA';


export const matchMedia = (isFullscreen) => ({
    type: MATCH_MEDIA,
    isFullscreen,
});

export const matchMediaOnInit = () => {
    return Boolean(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
};
