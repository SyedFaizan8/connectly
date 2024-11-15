import { Server, Socket } from 'socket.io';

const emailToSocketIdMap = new Map<string, string>();
const socketIdToEmailMap = new Map<string, string>();

export const initializeWebSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('Socket Connected:', socket.id);

        socket.on('room:join', (data) => {
            const { email, room } = data;
            emailToSocketIdMap.set(email, socket.id);
            socketIdToEmailMap.set(socket.id, email);
            socket.join(room);
            io.to(room).emit('user:joined', { email, id: socket.id });
            io.to(socket.id).emit('room:join', data);
        });

        socket.on('user:call', ({ to, offer }) => {
            io.to(to).emit('incoming:call', { from: socket.id, offer });
        });

        socket.on('call:accepted', ({ to, ans }) => {
            io.to(to).emit('call:accepted', { from: socket.id, ans });
        });

        socket.on('peer:nego:needed', ({ to, offer }) => {
            io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
        });

        socket.on('peer:nego:done', ({ to, ans }) => {
            io.to(to).emit('peer:nego:final', { from: socket.id, ans });
        });

        socket.on('disconnect', () => {
            const email = socketIdToEmailMap.get(socket.id);
            if (email) {
                emailToSocketIdMap.delete(email);
                socketIdToEmailMap.delete(socket.id);
            }
            console.log('Socket Disconnected:', socket.id);
        });
    });
};
