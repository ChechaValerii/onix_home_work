import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UserService } from '../user/user.service';
import { IRoom } from './interfaces/room.interfaces';
import { UserData } from '../auth/decorators/user.decorator';
import { IsEmail } from 'class-validator';
import { MessageService } from '../message/message.service';


@Controller('/room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService, 
    private readonly userServise: UserService,
    private readonly messageService: MessageService) {

    }
  
  @Post('/save')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get('/create')
  @Render('createRoom.hbs')
  createRoom(){}

  // @Render('roomList.hbs')
  @Get('/')
  @Render('rooms.hbs')
  async findAll(@UserData() user)  {
      
    const rooms = await this.roomService.findAll()
    return  {title: 'chat', rooms};
  }

  @Get('/:id/chat')
  @Render('chat.hbs')
  @Redirect('/message/by-room/:roomId')
  async getRoomById(@Param('id') id: string, @UserData() user ) {
    const messages = await this.messageService.getAllMessagesByRoom(id);
    //const name: string = user.userName 
    console.log(user);
    
    
    return { messages, user};
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto):Promise<IRoom> {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string):Promise<IRoom> {
    return this.roomService.remove(id);
  }
  
  @Get('/by-user/:ownerId')
  getAllRoomsByUser(@Param('ownerId') ownerId: string): Promise<IRoom[]> {
    return this.roomService.getAllRoomsByUser(ownerId);
  }

} 
