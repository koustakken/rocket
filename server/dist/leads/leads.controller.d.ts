import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    getLeads(): Promise<any[]>;
    getSearchLeads(searchTerm: string): Promise<any[]>;
}
