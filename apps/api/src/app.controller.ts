import { Body, Controller, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // FIXME: Delete this in future
  @Post('create-user')
  async createUser(@Body() { name, email }) {
    return this.appService.getUser(name, email)
  }
}
