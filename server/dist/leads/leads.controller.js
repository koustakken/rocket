"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    getLeads() {
        return this.leadsService.getLeads();
    }
    getSearchLeads(searchTerm) {
        return this.leadsService.searchLeadbyName(searchTerm);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)('leads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Get)('leads/:searchterm'),
    __param(0, (0, common_1.Param)('searchterm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getSearchLeads", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map