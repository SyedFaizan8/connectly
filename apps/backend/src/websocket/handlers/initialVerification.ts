import { Server, Socket } from 'socket.io';
import { verify } from "jsonwebtoken";

export const initialSocketConfig = async (
    _: Server,
    socket: Socket
) => {
    const jwtToken: string = socket.handshake.auth.accessToken;
    const { _id }: any = verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

    // Auth user's detail
    const userPayload = await db
        .collection("googleAuthUsers")
        .findOne({ _id: new ObjectId(_id) });

    // All users data
    const users = await db.collection("googleAuthUsers").find().toArray();

    return {
        _id,
        db,
        userPayload,
        users,
    };
};
