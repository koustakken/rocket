import { Controller, Get, Param } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('api')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get('leads')
  getLeads() {
    // return this.leadsService.testConnection();
    return this.leadsService.getLeads();
    // return this.leadsService.getPipelineById(id);
  }

  @Get('leads/:searchterm')
  getSearchLeads(@Param('searchterm') searchTerm: string) {
    return this.leadsService.searchLeadbyName(searchTerm);
  }
}
