// Uncomment these imports to begin using these cool features!

import { repository } from '@loopback/repository';
import { HttpErrors, post, requestBody } from '@loopback/rest';
import { StudentRepository, UserRepository } from '../repositories';
import { AuthService } from '../services/auth.service';
import {NotificationService} from '../services/notification.service';
import {EmailNotification, SmsNotification} from '../models';

// import {inject} from '@loopback/core';

class Credentials {
  username: string;
  password: string;
}
class PasswordResetData {
  username: string;
  type: number;
}

export class UserController {

  authService: AuthService;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(StudentRepository)
    public studentRepository: StudentRepository
  ) {
    this.authService = new AuthService(this.userRepository);
  }


  @post('/login', {
    responses: {
      '200': {
        description: 'Login for useres'
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials
  ): Promise<object> {
    let user = await this.authService.Identify(credentials.username, credentials.password);
    if (user) {
      let tk = await this.authService.GenerateToken(user);
      return {
        data: user,
        token: tk
      }
    } else {
      throw new HttpErrors[401]("User or Password invalid.")
    }
  }

  @post('/password-reset', {
    responses: {
      '200': {
        description: 'Login for useres'
      }
    }
  })

  async reset(
    @requestBody() passwordResetData: PasswordResetData
  ): Promise<boolean> {
    let randomPassword = await this.authService.ResetPassword(passwordResetData.username);
    if (randomPassword) {
      //send sms with new password
      //1 SMS
      //2 Mail
      let student = await this.studentRepository.findOne({ where: { document: passwordResetData.username } })
      switch (passwordResetData.type) {
        case 1:
          // send sms
          if (student) {
            let notification = new SmsNotification({
              body: `Su nueva contrase??a es: ${randomPassword}`,
              to: student.phone
            });
            let sms=await new NotificationService().SmsNotification(notification);
            if (sms) {
              console.log("sms message sent");
              
             return true; 
            }
            throw new HttpErrors[400]("Phone is not found");
            
          }
          throw new HttpErrors[400]("User not found");
          break;
        case 2:
          // send mail
          if (student) {
            let notification = new EmailNotification({
              textBody: `Su nueva contrase??a es: ${randomPassword}`,
              htmlBody: `Su nueva contrase??a es: ${randomPassword}`,
              to: student.email,
              subject:'Nueva contrase??a'
            });
            let email=await new NotificationService().MailNotification(notification);
            if (email) {
              console.log("email message sent");
              
             return true; 
            }
            throw new HttpErrors[400]("Email is not found");
            
          }
          throw new HttpErrors[400]("User not found");
          break;

        default:
          break;
      }

    }
    throw new HttpErrors[400]("This notification type is not supported");
  }
}

