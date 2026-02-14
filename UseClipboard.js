// ==UserScript==
// @name         UseClipboard
// @namespace    http://tampermonkey.net/
// @version      2026-01-22
// @description  Make creating exams on the RELIAS platform a little easier when using copy-n-paste. See ReadMe for full
// @author       Nick M (https://connect.relias.com/s/profile/005RM00000AQ7Cz) @ Relias Connect Groups
// @homepageURL  https://github.com/KahalaNuiNick/TM-ReliasExam
// @match        *://*.reliaslearning.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reliaslearning.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

        // Set to true to remove the first character, false to keep it
    const STRIP_PREFIX = true;

    async function pasteByPressedKey(pressedKey) {
        try {
            const text = await navigator.clipboard.readText();
            const rows = text.split(/\r?\n/);

            // Find the first row starting with the character of the key you pressed
            // .toLowerCase() is used to ensure 'a' matches 'A' if desired
            const matchedRow = rows.find(row =>
                row.trim().toLowerCase().startsWith(pressedKey.toLowerCase())
            );

            if (matchedRow) {
                const activeElem = document.activeElement;
                const isInput = activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA');

                if (isInput) {
                    let textToPaste = matchedRow.trim();
                    if (STRIP_PREFIX) {
                        textToPaste = textToPaste.substring(3);
                    }

                    // Insert at cursor position
                    const start = activeElem.selectionStart;
                    const end = activeElem.selectionEnd;
                    activeElem.value = activeElem.value.substring(0, start) +
                                       textToPaste +
                                       activeElem.value.substring(end);

                    // Reposition cursor
                    activeElem.selectionStart = activeElem.selectionEnd = start + textToPaste.length;
                }
            }
        } catch (err) {
            console.error('Clipboard access error:', err);
        }
    }

    // Trigger: Alt + any character key
    document.addEventListener('keydown', (e) => {
        // Use a modifier like Alt to avoid interfering with normal typing
        if (e.altKey && e.key.length === 1) {
            e.preventDefault(); // Stop the default Alt+Key browser action
            pasteByPressedKey(e.key);
        }
    });
})();
