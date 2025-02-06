import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './DB-Connection/database.module';
import { EmployeeModule } from './Module/employee/employee.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmployeeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
