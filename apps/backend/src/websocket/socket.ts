import { Server, Socket } from 'socket.io';
import { ApiError } from '../utils/ApiError';
import { initialSocketConfig } from './handlers/initialVerification';
import { handleActiveSession } from './handlers/handleActiveSession';
import { isAuthSocket } from '../middlewares/socket.middleware';
import { callOtherUser } from './handlers/callOtherUser';
import { joinVideoRoom } from './handlers/joinVideoRoom';
import { disconnectVideoCall } from './handlers/disconnectVideoCall';
import { rejectVideoCall } from './handlers/rejectVideoCall';
import { userOnCall } from './handlers/userOnCall';
import { getTotalUsers } from './handlers/getTotalUser';
import { updateUserProfile } from './handlers/updateUserProfile';
import { updateGroupInfo } from './handlers/updateGroupInfo';
import { updateOthersChats } from './handlers/updateOthersChats';
import { iTextMessage } from './handlers/iTextMessage';
import { socketDisconnect } from './handlers/socketDisconnect';

export const initializeWebSocket = (io: Server) => {

    io.use(isAuthSocket); // authorization of socket token

    io.on('connection', async (socket: Socket) => {
        try {
            console.log('Socket Connected:', socket.id);

            // initial jwt verification
            const { _id, db, userPayload, users } = await initialSocketConfig(io, socket);

            // caching connected members and storing _id in an array
            handleActiveSession(io, socket, _id);

            // Signin success state
            socket.emit("signInSuccess", {
                objectId: _id,
                displayName: userPayload.displayName,
                email: userPayload.email,
                avatar: userPayload.avatar,
                createdOn: userPayload.createdOn,
                about: userPayload.about,
                lastSeen: userPayload.lastSeen,
            });

            // call other user
            socket.on("callOtherUser", (payload: any) =>
                callOtherUser(io, _id, db, payload)
            );

            // join user to a video call room
            socket.on("join-vc-room", (roomId: string, peerUserId: string) =>
                joinVideoRoom(socket, roomId, peerUserId)
            );

            // when user ends vc after joining
            socket.on("diconnect-from-call", (roomId: string, peerUserId: string) =>
                disconnectVideoCall(socket, roomId, peerUserId)
            );

            // whien user rejects call
            socket.on("reject-call", (roomId: string) =>
                rejectVideoCall(socket, roomId)
            );

            // when user is already on call
            socket.on("user-on-call", (roomId: string) => userOnCall(socket, roomId));

            // Send users existing in DB back to sender
            socket.on("getTotalUsers", () => getTotalUsers(socket, users, _id));

            // Update logged user state to others
            socket.broadcast.emit("updateTotalUsers", {
                objectId: userPayload._id,
                displayName: userPayload.displayName,
                email: userPayload.email,
                avatar: userPayload.avatar,
                createdOn: userPayload.createdOn,
                about: userPayload.about,
                lastSeen: userPayload.lastSeen,
            });

            // Verification needed
            socket.on(
                "updateUserProfile",
                async (payload: any) => await updateUserProfile(socket, _id, payload, db)
            );


            // Verification needed
            socket.on("updateGroupInfo", async (payload: any) =>
                updateGroupInfo(io, _id, payload, db)
            );


            socket.on("updateOthersChats", (payload: any) =>
                updateOthersChats(io, _id, payload)
            );

            // handle incoming messages
            socket.on("iTextMessage", async (payload: any) =>
                iTextMessage(io, socket, payload, db)
            );

            // Handle online status
            socket.broadcast.emit("online", _id);

            socket.on("disconnect", async () => socketDisconnect(socket, _id, db));

            io.on('disconnect', () => {
                console.log('Socket Disconnected:', socket.id);
            })
        } catch (error) {
            throw new ApiError(500, "Failed in socket after connection")
        }

    })
}