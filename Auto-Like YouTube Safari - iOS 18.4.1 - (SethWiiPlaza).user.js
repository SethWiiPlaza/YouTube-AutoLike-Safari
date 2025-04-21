// ==UserScript==
// @name         Force Auto Like YouTube Mobile
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Aggressively auto-clicks Like button on m.youtube.com videos
// @author       Seth@WiiPlaza
// @match        https://m.youtube.com/watch*
// @run-at       document-start
// @grant        none
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85aa6584-7ebf-439b-b994-59802e194f0b/djm0ls4-ac1eba6a-6058-4454-9ce9-6eba6ad26b23.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg1YWE2NTg0LTdlYmYtNDM5Yi1iOTk0LTU5ODAyZTE5NGYwYlwvZGptMGxzNC1hYzFlYmE2YS02MDU4LTQ0NTQtOWNlOS02ZWJhNmFkMjZiMjMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ei28OmVYY6hrSLNsa61AIocsIhsN2VKBCRUv2N6lTc4
// ==/UserScript==

(function() {
    'use strict';

    const interval = setInterval(() => {
        const likeBtn = Array.from(document.querySelectorAll('like-button-view-model button'))
            .find(btn => btn.getAttribute('aria-pressed') === 'false' && btn.getAttribute('aria-label')?.includes('like this video'));

        if (likeBtn) {
            likeBtn.click();
            console.log('[AutoLike] Clicked Like button');
            clearInterval(interval);
        }
    }, 1000);

    document.addEventListener('yt-navigate-finish', () => {
        setTimeout(() => {
            location.reload();
        }, 500);
    });
})();