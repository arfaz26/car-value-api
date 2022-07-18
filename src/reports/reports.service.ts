import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from 'src/dto/reports/createReport.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}
  create(reportData: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(reportData);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('report not found!');
    }
    report.approved = approved;
    return await this.reportsRepository.save(report);
  }
}
