import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from 'src/dto/reports/createReport.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}
  create(reportData: CreateReportDto) {
    const report = this.reportsRepository.create(reportData);
    return this.reportsRepository.save(report);
  }
}
