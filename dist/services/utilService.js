"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sleep(sec) {
    return new Promise((resolve) => {
        setTimeout(resolve, sec * 1000);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=utilService.js.map