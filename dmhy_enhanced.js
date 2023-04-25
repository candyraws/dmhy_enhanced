// ==UserScript==
// @name         DMHY Enhanced
// @author       CandyRaws
// @match        https://share.dmhy.org/*
// @version      1.0
// @description  将磁力链接改到标题前，使标题变为可点击复制的磁力链接，点击磁力链接图标进入详情页
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 成功复制的提示 | 显示在鼠标指针右上角
    function showTooltip(event) {
        var tooltip = document.createElement("div");
        tooltip.textContent = "已复制 磁力链接";
        tooltip.style.position = "fixed";
        tooltip.style.left = event.clientX + 10 + "px";
        tooltip.style.top = event.clientY - 30 + "px";
        tooltip.style.padding = "5px";
        tooltip.style.background = "rgba(0,0,0,0.8)";
        tooltip.style.color = "white";
        tooltip.style.borderRadius = "5px";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.5s";

        document.body.appendChild(tooltip);

        setTimeout(function() {
            tooltip.style.opacity = "1";
        }, 10);

        setTimeout(function() {
            tooltip.style.opacity = "0";
        }, 1500);

        setTimeout(function() {
            tooltip.remove();
        }, 2000);
    }

    // 磁力链接移动到标题前
    // Find all tables on the page
    let tables = document.querySelectorAll('table');

    // Loop through each table
    tables.forEach(table => {
        // Find the header row and swap the 3rd and 4th th elements
        let headerRow = table.querySelector('thead tr');
        if (headerRow) {
            let thirdHeader = headerRow.querySelector('th:nth-child(3)');
            let fourthHeader = headerRow.querySelector('th:nth-child(4)');
            if (thirdHeader && fourthHeader) {
                headerRow.insertBefore(fourthHeader, thirdHeader);
                fourthHeader.style.width = '1%';
            }
        }

        // Find all body rows and swap the 3rd and 4th td elements in each row
        let bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            let thirdCell = row.querySelector('td:nth-child(3)');
            let fourthCell = row.querySelector('td:nth-child(4)');
            if (thirdCell && fourthCell) {
                row.insertBefore(fourthCell, thirdCell);
                let thirdLink = thirdCell.querySelector('a[target="_blank"]');
                let fourthLink = fourthCell.querySelector('a');
                if (thirdLink && fourthLink) {
                    let thirdHref = thirdLink.getAttribute('href');
                    thirdLink.removeAttribute('target');
                    fourthLink.setAttribute("target", "_blank");
                    // 改为复制
                    thirdLink.addEventListener('click', event => {
                        event.preventDefault();
                        navigator.clipboard.writeText(fourthHref);
                        showTooltip(event);
                    });
                    // 复制完毕
                    let fourthHref = fourthLink.getAttribute('href');
                    thirdLink.setAttribute('href', fourthHref);
                    fourthLink.setAttribute('href', thirdHref);
                }
            }
        });
    });
})();
