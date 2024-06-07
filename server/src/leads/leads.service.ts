import { Injectable } from '@nestjs/common';
import { Client } from 'amocrm-js';
import { AMOCRM_CONFIG } from 'src/auth/config';

@Injectable()
export class LeadsService {
  private readonly client: Client;
  constructor() {
    this.client = new Client({
      domain: 'kouswalljust',
      auth: {
        client_id: AMOCRM_CONFIG.client_id,
        client_secret: AMOCRM_CONFIG.client_secret,
        redirect_uri: AMOCRM_CONFIG.redirect_uri,
        bearer: AMOCRM_CONFIG.code,
      },
    });
  }

  async getLeads() {
    try {
      const leads = await this.client.request.get(
        '/api/v4/leads?with=contacts',
      );
      const preparePromises = leads.data['_embedded'].leads.map(
        (lead, index) => ({
          key: index + 1,
          name: lead.name,
          price: lead.price,
          created_at: new Date(lead.created_at).toLocaleDateString(),
          company:
            this.getCompanyById(lead['_embedded'].companies[0].id) || '-',
          contacts:
            this.getContactsById(lead['_embedded'].contacts[0].id) || '-',
          manager: this.getManagerById(lead.responsible_user_id) || '-',
          pipeline: this.getPipelineById(lead.pipeline_id) || '-',
        }),
      );

      const prepare = await Promise.all(
        preparePromises.map(async (preparePromises) => {
          return {
            ...preparePromises,
            company: await preparePromises.company,
            contacts: await preparePromises.contacts,
            manager: await preparePromises.manager,
            pipeline: await preparePromises.pipeline,
          };
        }),
      );

      return prepare;
    } catch (error) {
      console.log('Error fetching leads', error);
    }
  }

  async searchLeadbyName(searchTerm: string) {
    try {
      const response = await this.client.request.get('/api/v4/leads', {
        with: 'contacts',
        query: searchTerm,
      });
      // return response.data['_embedded'].leads;

      const preparePromises = response.data['_embedded'].leads.map(
        (lead, index) => ({
          key: index + 1,
          name: lead.name,
          price: lead.price,
          created_at: new Date(lead.created_at).toLocaleDateString(),
          company:
            this.getCompanyById(lead['_embedded'].companies[0].id) || '-',
          contacts:
            this.getContactsById(lead['_embedded'].contacts[0].id) || '-',
          manager: this.getManagerById(lead.responsible_user_id) || '-',
          pipeline: this.getPipelineById(lead.pipeline_id) || '-',
        }),
      );
      const prepare = await Promise.all(
        preparePromises.map(async (preparePromises) => {
          return {
            ...preparePromises,
            company: await preparePromises.company,
            contacts: await preparePromises.contacts,
            manager: await preparePromises.manager,
            pipeline: await preparePromises.pipeline,
          };
        }),
      );

      return prepare;
    } catch (error) {
      console.log('Error search leads', error);
    }
  }

  async getCompanyById(id: string) {
    try {
      const response = await this.client.request.get('/api/v4/companies', {
        id,
      });
      return response.data['_embedded'].companies[0].name;
    } catch (error) {
      console.log('Error fetch company', error);
    }
  }

  async getContactsById(id: string) {
    try {
      const response = await this.client.request.get('/api/v4/contacts', {
        id,
      });
      return response.data['_embedded'].contacts[0].name;
    } catch (error) {
      console.log('Error fetch contacts', error);
    }
  }

  async getManagerById(id: string) {
    try {
      const response = await this.client.request.get('/api/v4/users', {
        id,
      });
      return response.data['_embedded']['users'][0].name;
    } catch (error) {
      console.log('Error fetch contacts', error);
    }
  }

  async getPipelineById(id: string) {
    try {
      const response = await this.client.request.get(
        '/api/v4/leads/pipelines/8251830/statuses',
        {
          id,
        },
      );
      return response.data['_embedded'].statuses[0].name;
    } catch (error) {
      console.log('Error fetch contacts', error);
    }
  }
}
