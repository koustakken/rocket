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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const amocrm_js_1 = require("amocrm-js");
const config_1 = require("../auth/config");
let LeadsService = class LeadsService {
    constructor() {
        this.client = new amocrm_js_1.Client({
            domain: config_1.AMOCRM_CONFIG.domain,
            auth: {
                client_id: config_1.AMOCRM_CONFIG.client_id,
                client_secret: config_1.AMOCRM_CONFIG.client_secret,
                redirect_uri: config_1.AMOCRM_CONFIG.redirect_uri,
                bearer: config_1.AMOCRM_CONFIG.code,
            },
        });
    }
    async prepareLeadData(leads) {
        const preparedLeadsPromises = leads.map((lead) => this.prepareLeadDataHelper(lead));
        const preparedLeads = await Promise.allSettled(preparedLeadsPromises);
        const fulfilledResults = preparedLeads.filter((result) => result.status === 'fulfilled');
        const preparedData = fulfilledResults.map((result) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            else {
                return { error: 'Failed to prepare lead data' };
            }
        });
        return preparedData;
    }
    async prepareLeadDataHelper(lead) {
        try {
            const companyId = lead['_embedded'].companies[0].id;
            const contactId = lead['_embedded'].contacts[0].id;
            const managerId = lead.responsible_user_id;
            const pipelineId = lead.status_id;
            const [company, contact, manager, pipeline] = await Promise.allSettled([
                this.getCompanyById(companyId),
                this.getContactsById(contactId),
                this.getManagerById(managerId),
                this.getPipelineById(pipelineId),
            ]);
            return {
                key: Math.random(),
                name: lead.name,
                price: lead.price,
                created_at: new Date(lead.created_at).toLocaleDateString(),
                company: company.status === 'fulfilled' ? company.value : '-',
                contacts: contact.status === 'fulfilled' ? contact.value : '-',
                manager: manager.status === 'fulfilled' ? manager.value : '-',
                pipeline: pipeline.status === 'fulfilled' ? pipeline.value : '-',
            };
        }
        catch (error) {
            console.error('Error preparing lead data', error);
            throw error;
        }
    }
    async fetchData(url, params = {}) {
        try {
            const response = await this.client.request.get(url, params);
            return response.data['_embedded'];
        }
        catch (error) {
            console.error(`Error fetching data from ${url}`, error);
            throw error;
        }
    }
    async testConnection() {
        console.log(config_1.AMOCRM_CONFIG);
        return await this.client.connection.connect();
    }
    async getLeads() {
        try {
            const leads = await this.fetchData('/api/v4/leads?with=contacts');
            const preparedLeads = await this.prepareLeadData(leads.leads);
            return preparedLeads;
        }
        catch (error) {
            console.error('Error fetching leads', error);
            throw error;
        }
    }
    async searchLeadbyName(searchTerm) {
        try {
            const response = await this.fetchData('/api/v4/leads', {
                with: 'contacts',
                query: searchTerm,
            });
            console.log('@search', response.leads);
            const leads = response.leads;
            const preparedLeads = await this.prepareLeadData(leads);
            return preparedLeads;
        }
        catch (error) {
            console.error('Error searching leads', error);
            throw error;
        }
    }
    async getCompanyById(id) {
        return this.fetchData('/api/v4/companies', { id })
            .then((data) => data.companies[0].name)
            .catch((error) => {
            console.error('Error fetching company', error);
            throw error;
        });
    }
    async getContactsById(id) {
        try {
            const response = await this.fetchData('/api/v4/contacts', { id });
            const result = response.contacts[0];
            return [result.name, result.custom_fields_values[0].values[0].value];
        }
        catch (error) {
            console.log(error);
        }
    }
    async getManagerById(id) {
        return this.fetchData('/api/v4/users', { id })
            .then((data) => data.users[0].name)
            .catch((error) => {
            console.error('Error fetching manager', error);
            throw error;
        });
    }
    async getPipelineById(id) {
        try {
            const response = await this.fetchData('/api/v4/leads/pipelines/8251830/statuses', { id });
            const result = response.statuses.find((m) => m.id == id);
            return [result.name, result.color];
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LeadsService);
//# sourceMappingURL=leads.service.js.map