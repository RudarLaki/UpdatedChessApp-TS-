import { Request, Response } from "express";
import { ddb } from "../services/awsService";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import crypto from "crypto";
import { userService } from "../services/userService";
import { ChessGame } from "../models/ChessGame";

const GAME_TABLE = "Game";
const USERS_TABLE = "Users";

const endGame = async (req: Request, res: Response) => {};

export { endGame };
