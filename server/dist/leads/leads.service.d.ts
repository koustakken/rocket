export declare class LeadsService {
    private readonly client;
    constructor();
    prepareLeadData(leads: any): Promise<any[]>;
    prepareLeadDataHelper(lead: any): Promise<{
        key: number;
        name: any;
        price: any;
        created_at: string;
        company: any;
        contacts: string | any[];
        manager: any;
        pipeline: string | any[];
    }>;
    private fetchData;
    testConnection(): Promise<boolean>;
    getLeads(): Promise<any[]>;
    searchLeadbyName(searchTerm: string): Promise<any[]>;
    getCompanyById(id: string): Promise<any>;
    getContactsById(id: string): Promise<any[]>;
    getManagerById(id: string): Promise<any>;
    getPipelineById(id: string): Promise<any[]>;
}
