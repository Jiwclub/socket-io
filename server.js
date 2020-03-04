const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
let users = [];
let messages = [];
let index = 0;

io.on("connection", socket => {
  
  //เชื่อม
  socket.emit('loggedIn', {
		users: users.map(s => s.username),
		messages: messages
	});

  socket.on('newuser', username => {
    // สร้าง user ให้ใหม่อีกคน
		console.log(`${username} has arrived at the party.`);
		socket.username = username;
		
		users.push(socket);
    // คนที่ออนไลน์
		io.emit('userOnline', socket.username);
	});
  socket.on("msg", msg => {
    // ข้อความที่รับมา
    let message = {
      index: index,
      username: socket.username,
      msg: msg
    }
    // ข้อความส่ง
    messages.push(message);
    io.emit("msg", message);
    
    index +=1;
  });
  //Disconnect
  socket.on("disconnect", () => {
		console.log(`${socket.username} has left the party.`);
		io.emit("userLeft", socket.username);
		users.splice(users.indexOf(socket), 1);
	});
});
http.listen(process.env.PORT || 3000, () => {
  console.log("Listenin", process.env.PORT || 3000);
});
