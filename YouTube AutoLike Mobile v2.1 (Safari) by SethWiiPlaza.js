// ==UserScript==
// @name         YouTube Mobile Auto Like Enhanced
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Auto-likes m.youtube.com videos reliably when the Like button is available
// @author       Seth@WiiPlaza
// @match        https://m.youtube.com/watch*
// @run-at       document-idle
// @grant        none
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85aa6584-7ebf-439b-b994-59802e194f0b/djm0ls4-ac1eba6a-6058-4454-9ce9-6eba6ad26b23.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg1YWE2NTg0LTdlYmYtNDM5Yi1iOTk0LTU5ODAyZTE5NGYwYlwvZGptMGxzNC1hYzFlYmE2YS02MDU4LTQ0NTQtOWNlOS02ZWJhNmFkMjZiMjMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ei28OmVYY6hrSLNsa61AIocsIhsN2VKBCRUv2N6lTc4
// ==/UserScript==

(function() {
    'use strict';

    let hasLiked = false;
    const maxRetries = 5;
    const retryDelay = 3000;
    let retryCount = 0;

    function isLikeButton(button) {
        const label = button.getAttribute('aria-label') || '';
        const pressed = button.getAttribute('aria-pressed');
        return pressed === 'false' && /like (this )?video/i.test(label);
    }

    function findLikeButton() {
        return Array.from(document.querySelectorAll('button'))
            .find(btn => isLikeButton(btn));
    }

    function waitForElement(checkFn, maxAttempts = 60, interval = 500) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const timer = setInterval(() => {
                const element = checkFn();
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else if (++attempts >= maxAttempts) {
                    clearInterval(timer);
                    reject('Like button not found in time.');
                }
            }, interval);
        });
    }

    async function tryClickLike() {
        try {
            const likeBtn = await waitForElement(findLikeButton);
            if (!hasLiked && likeBtn) {
                likeBtn.click();
                hasLiked = true;
                retryCount = 0;
                console.log('[AutoLike] ✅ Liked the video.');
            }
        } catch (e) {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.warn(`[AutoLike] Retry ${retryCount}/${maxRetries}`);
                setTimeout(tryClickLike, retryDelay);
            } else {
                console.warn('[AutoLike] ❌ Gave up after retries.');
            }
        }
    }

    function observePageChanges() {
        const observer = new MutationObserver(() => {
            hasLiked = false;
            retryCount = 0;
            tryClickLike();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function onYouTubePageChange() {
        hasLiked = false;
        retryCount = 0;
        tryClickLike();
    }

    document.addEventListener('DOMContentLoaded', tryClickLike);
    document.addEventListener('yt-page-data-updated', onYouTubePageChange);
    document.addEventListener('yt-navigate-finish', onYouTubePageChange);

    observePageChanges();
})();
