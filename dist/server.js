"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const scrapService_1 = require("./services/scrapService");
const port = process.env.PORT || 3500;
app_1.default.listen(port, () => {
    console.log(`express server running in port 3500`);
    scrapService_1.default.startScrap();
});
//# sourceMappingURL=server.js.map