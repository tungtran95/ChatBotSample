// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();
var titles;
var app = express();
//var sleep = require('sleep');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === '1111') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

//Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  
  var entries = req.body.entry;
  //console.log(entries);
  for(var entry of entries){
      var messaging = entry.messaging;
      for(var message of messaging){
        var senderID = message.sender.id;
        console.log(senderID);
        console.log(message);
        if(message.postback) {
            console.log("postback.............11111111");
            sendHello(senderID);
        }
        else if(message.message){
            
            receivedMessage(message);
            console.log("Text.............2222222222222");
        }
        else {
          console.log("No.............000000000000");
        }
      }
    
  }
  
  res.status(200).send("Ok");
  
});

// app.post('/webhook', function (req, res) {
// 	var messaging_events = req.body.entry[0].messaging;
// 	for (var i = 0; i < messaging_events.length; i++) {
// 		var event = req.body.entry[0].messaging[i];
// 		var sender = event.sender.id;
// 		if (event.message && event.message.text) {
// 			var text = event.message.text;
// 			if (text === 'Generic') {
// 				//sendGenericMessage(sender);
// 				break;
// 			}
// 			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
// 		}
// 		if (event.postback) {
// 			var text = JSON.stringify(event.postback);
// 			sendTextMessage(sender, "Postback received: "+text.substring(0, 200));
// 			break;
// 		}
// 	}
// 	res.status(200).send("OK");
// });


function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s", 
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'hello':
         sendHello(senderID);
        break;
      case 'Hello':
        sendHello(senderID);
        break;
      case 'hi':
        sendHello(senderID);
        break;
      case 'Hi':
        sendHello(senderID);
        break;
      case 'chào':
        sendHello(senderID);
        break;
      case 'Chào':
        sendHello(senderID);
        break;
      case 'Tìm kiếm nhà':
        sendTextMessage(senderID,"Bạn muốn tìm kiếm 🔎 bất động sản 🏡 ở đâu?");
        sendTextMessage(senderID,"Bạn có thể gõ địa chỉ theo format 'đường(quận), thành phố' Ví dụ: Hai Bà Trưng, Hà Nội 8|");
        break;
      case 'Hà Nội':
        sendTextMessage(senderID,"Đang tìm kiếm nhà ở Hà Nội...");
      // sleep.sleep(2);
        sendTextMessage(senderID,"Hiện tại có 100 tin rao đăng bán nhà tại khu vực này.");
      // sleep.sleep(4);
        sendTextMessage(senderID,"Top 10 tin rao:");
      // sleep.sleep(6);
        sendGenericMessage(senderID);
        break;
      default:
        sendHello(senderID);
        break;
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}












function sendHello(recipientId) {
  var messageData = {
    recipient: {
            id: recipientId
          },
          message: {
              attachment: {
                  type: "template",
                  payload: {
                      template_type: "button",
                      text: "Xin chào :),\nHometag ChatBot có thể giúp gì cho bạn?",
                      buttons:[ {
                          type: "postback",
                          title: "Tìm kiếm nhà",
                          payload: "DEVELOPER_DEFINED_PAYLOAD"
                      },{
                          type: "postback",
                          title: "Tính giá nhà",
                          payload: "DEVELOPER_DEFINED_PAYLOAD"
                      }]
                  }
              }
          }
      };


  callSendAPI(messageData);
}






  
/*
 * Send an image using the Send API.
 *
 */
// function sendImageMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "image",
//         payload: {
//           url: "http://www.w3schools.com/css/paris.jpg"
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send a Gif using the Send API.
// *
// */
// function sendGifMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "image",
//         payload: {
//           url: "/assets/instagram_logo.gif"
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send audio using the Send API.
// *
// */
// function sendAudioMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "audio",
//         payload: {
//           url: "/assets/sample.mp3"
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send a video using the Send API.
// *
// */
// function sendVideoMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "video",
//         payload: {
//           url: "/assets/allofus480.mov"
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send a file using the Send API.
// *
// */
// function sendFileMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "file",
//         payload: {
//           url: "/assets/test.txt"
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a button message using the Send API.
 *
 */
// function sendButtonMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "button",
//           text: "This is test text",
//           buttons:[{
//             type: "web_url",
//             url: "https://www.oculus.com/en-us/rift/",
//             title: "Open Web URL"
//           }, {
//             type: "postback",
//             title: "Trigger Postback",
//             payload: "DEVELOPER_DEFINED_PAYLOAD"
//           }, {
//             type: "phone_number",
//             title: "Call Phone Number",
//             payload: "+16505551234"
//           }]
//         }
//       }
//     }
//   };  

//   callSendAPI(messageData);
// }

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://file.vforum.vn/hinh/2016/10/anh-bia-zalo-dep-chat-nhat-1.jpg",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://file.vforum.vn/hinh/2016/10/anh-bia-zalo-dep-chat-nhat-1.jpg",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*
 * Send a receipt message using the Send API.
 *
 */
// function sendReceiptMessage(recipientId) {
//   // Generate a random receipt ID as the API requires a unique ID
//   var receiptId = "order" + Math.floor(Math.random()*1000);

//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message:{
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "receipt",
//           recipient_name: "Peter Chang",
//           order_number: receiptId,
//           currency: "USD",
//           payment_method: "Visa 1234",        
//           timestamp: "1428444852", 
//           elements: [{
//             title: "Oculus Rift",
//             subtitle: "Includes: headset, sensor, remote",
//             quantity: 1,
//             price: 599.00,
//             currency: "USD",
//             image_url: "/assets/riftsq.png"
//           }, {
//             title: "Samsung Gear VR",
//             subtitle: "Frost White",
//             quantity: 1,
//             price: 99.99,
//             currency: "USD",
//             image_url: "/assets/gearvrsq.png"
//           }],
//           address: {
//             street_1: "1 Hacker Way",
//             street_2: "",
//             city: "Menlo Park",
//             postal_code: "94025",
//             state: "CA",
//             country: "US"
//           },
//           summary: {
//             subtotal: 698.99,
//             shipping_cost: 20.00,
//             total_tax: 57.67,
//             total_cost: 626.66
//           },
//           adjustments: [{
//             name: "New Customer Discount",
//             amount: -50
//           }, {
//             name: "$100 Off Coupon",
//             amount: -100
//           }]
//         }
//       }
//     }
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send a message with Quick Reply buttons.
// *
// */
// function sendQuickReply(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       text: "What's your favorite movie genre?",
//       quick_replies: [
//         {
//           "content_type":"text",
//           "title":"Action",
//           "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
//         },
//         {
//           "content_type":"text",
//           "title":"Comedy",
//           "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
//         },
//         {
//           "content_type":"text",
//           "title":"Drama",
//           "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
//         }
//       ]
//     }
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send a read receipt to indicate the message has been read
// *
// */
// function sendReadReceipt(recipientId) {
//   console.log("Sending a read receipt to mark message as seen");

//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     sender_action: "mark_seen"
//   };

//   callSendAPI(messageData);
// }

// /*
// * Turn typing indicator on
// *
// */
// function sendTypingOn(recipientId) {
//   console.log("Turning typing indicator on");

//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     sender_action: "typing_on"
//   };

//   callSendAPI(messageData);
// }

// /*
// * Turn typing indicator off
// *
// */
// function sendTypingOff(recipientId) {
//   console.log("Turning typing indicator off");

//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     sender_action: "typing_off"
//   };

//   callSendAPI(messageData);
// }

// /*
// * Send a message with the account linking call-to-action
// *
// */
// function sendAccountLinking(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "button",
//           text: "Welcome. Link your account.",
//           buttons:[{
//             type: "account_link",
//             url: "/authorize"
//           }]
//         }
//       }
//     }
//   };  

//   callSendAPI(messageData);
// }






function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAEVeGkTkF8BAMwdZBNl5NyiYBxncK8IypOZAnYc6SvzS2WZBJFpzcT3zvkovnXOyJZBT71hxZCrl3NsXAUuZAk7rJ7hDD6UmUHGhr5PZAS1huLx4SVSaNOXTrdQrGlumC3vGjstpLVgskcfPmmk0GWmbY4J2RBOYCnDEX9tdPkWwZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s", 
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });  
}


function getDATA() {
  var options = { method: 'POST',
                  url: 'http://api.hometag.vn/api/v3.0/realties/search/_filter/',
                  headers: 
                   { 'postman-token': '359b9afc-4bc6-9020-6fa3-4355b7f30949',
                     'cache-control': 'no-cache',
                     'content-type': 'application/json' },
                  body: { place: { city: 'da nang' } },
                  json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    titles=body.hits[0].title;
  });
  
}
// Gửi thông tin tới REST API để trả lời
// function sendMessage(senderId, message) {
//   request({
//     url: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: {
//       access_token: "EAAEVeGkTkF8BAMwdZBNl5NyiYBxncK8IypOZAnYc6SvzS2WZBJFpzcT3zvkovnXOyJZBT71hxZCrl3NsXAUuZAk7rJ7hDD6UmUHGhr5PZAS1huLx4SVSaNOXTrdQrGlumC3vGjstpLVgskcfPmmk0GWmbY4J2RBOYCnDEX9tdPkWwZDZD",
//     },
//     method: 'POST',
//     json: {
//       recipient: {
//         id: senderId
//       },
//       message: {
//         text: message
//       },
//     }
//   });
// }
// function sendButtonMessage(senderId) {
//     request({
//       url: 'https://graph.facebook.com/v2.6/me/messages',
//       qs: {
//         access_token: "EAAEVeGkTkF8BAMwdZBNl5NyiYBxncK8IypOZAnYc6SvzS2WZBJFpzcT3zvkovnXOyJZBT71hxZCrl3NsXAUuZAk7rJ7hDD6UmUHGhr5PZAS1huLx4SVSaNOXTrdQrGlumC3vGjstpLVgskcfPmmk0GWmbY4J2RBOYCnDEX9tdPkWwZDZD",
//       },
//       method: 'POST',
//       json: {
//           recipient: {
//             id: senderId
//           },
//           message: {
//               attachment: {
//                   type: "template",
//                   payload: {
//                       template_type: "button",
//                       text: "This is test text",
//                       buttons:[ {
//                           type: "postback",
//                           title: "Trigger Postback",
//                           payload: "DEVELOPER_DEFINED_PAYLOAD"
//                       }]
//                   }
//               }
//           },
//       }
//     });
  

  
// }


app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});