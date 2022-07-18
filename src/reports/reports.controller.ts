import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/decorators/serialize.decorator';
import { ApproveReportDto } from 'src/dto/reports/approveReport.dto';
import { CreateReportDto } from 'src/dto/reports/createReport.dto';
import { GetEstimateDto } from 'src/dto/reports/getEstimate.dto';
import { ReportDto } from 'src/dto/reports/report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/user.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(+id, body.approved);
  }
}
