import { Injectable } from '@nestjs/common';
import { Client } from 'amocrm-js';
import { AMOCRM_CONFIG } from 'src/auth/config';

@Injectable()
export class LeadsService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      domain: AMOCRM_CONFIG.domain,
      auth: {
        client_id: AMOCRM_CONFIG.client_id,
        client_secret: AMOCRM_CONFIG.client_secret,
        redirect_uri: AMOCRM_CONFIG.redirect_uri,
        bearer: AMOCRM_CONFIG.code,
      },
    });
  }

  async prepareLeadData(leads) {
    const preparedLeadsPromises = leads.map((lead) =>
      this.prepareLeadDataHelper(lead),
    );
    const preparedLeads = await Promise.allSettled(preparedLeadsPromises);

    const fulfilledResults = preparedLeads.filter(
      (result) => result.status === 'fulfilled',
    );
    const preparedData = fulfilledResults.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
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
      const pipelineId = lead.pipeline_id;

      const [company, contact, manager, pipeline] = await Promise.allSettled([
        this.getCompanyById(companyId),
        this.getContactsById(contactId),
        this.getManagerById(managerId),
        this.getPipelineById(pipelineId),
      ]);

      return {
        name: lead.name,
        price: lead.price,
        created_at: new Date(lead.created_at).toLocaleDateString(),
        company: company.status === 'fulfilled' ? company.value : '-',
        contacts: contact.status === 'fulfilled' ? contact.value : '-',
        manager: manager.status === 'fulfilled' ? manager.value : '-',
        pipeline: pipeline.status === 'fulfilled' ? pipeline.value : '-',
      };
    } catch (error) {
      console.error('Error preparing lead data', error);
      throw error;
    }
  }

  private async fetchData(url, params = {}) {
    try {
      const response = await this.client.request.get(url, params);
      return response.data['_embedded'];
    } catch (error) {
      console.error(`Error fetching data from ${url}`, error);
      throw error;
    }
  }

  async testConnection() {
    console.log(AMOCRM_CONFIG);
    return await this.client.connection.connect();
  }

  async getLeads() {
    try {
      const leads = await this.fetchData('/api/v4/leads?with=contacts');
      const preparedLeads = await this.prepareLeadData(leads.leads);
      return preparedLeads;
    } catch (error) {
      console.error('Error fetching leads', error);
      throw error;
    }
  }

  async searchLeadbyName(searchTerm: string) {
    try {
      const response = await this.fetchData('/api/v4/leads', {
        with: 'contacts',
        query: searchTerm,
      });
      console.log('@search', response.leads);
      const leads = response.leads;
      const preparedLeads = await this.prepareLeadData(leads);
      return preparedLeads;
    } catch (error) {
      console.error('Error searching leads', error);
      throw error;
    }
  }

  async getCompanyById(id: string) {
    return this.fetchData('/api/v4/companies', { id })
      .then((data) => data.companies[0].name)
      .catch((error) => {
        console.error('Error fetching company', error);
        throw error;
      });
  }

  async getContactsById(id: string) {
    return this.fetchData('/api/v4/contacts', { id })
      .then((data) => data.contacts[0].name)
      .catch((error) => {
        console.error('Error fetching contacts', error);
        throw error;
      });
  }

  async getManagerById(id: string) {
    return this.fetchData('/api/v4/users', { id })
      .then((data) => data.users[0].name)
      .catch((error) => {
        console.error('Error fetching manager', error);
        throw error;
      });
  }

  async getPipelineById(id: string) {
    return this.fetchData('/api/v4/leads/pipelines/8251830/statuses', { id })
      .then((data) => data.statuses[0].name)
      .catch((error) => {
        console.error('Error fetching pipeline', error);
        throw error;
      });
  }
}
