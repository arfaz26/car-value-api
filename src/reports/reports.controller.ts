import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from 'src/dto/reports/createReport.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
