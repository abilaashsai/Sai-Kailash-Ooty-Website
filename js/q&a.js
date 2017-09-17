// function readData() {
//     firebase.database().ref(question).once('value').then(function (snapshot) {
//         document.getElementsByClassName('loading')[0].remove();
//         snapshot.forEach(function (id) {
//             addDetailsToUI(id.key, id.val().question, id.val().answer)
//         });
//     });
//
// }
//
// function addContentIntoUI(date, title, content, imageUrl, imagedescription) {
//     var modifiedDate = date.replace(/ /g, "_");
//     var modifiedTitle = modifiedDate + title;
//     var element = "<article> <div class=\"content\" id=\"" + modifiedTitle + "\"></div><div> <p align=\"justify\">" + content + "</p></div> </article>";
//
//     $("#" + modifiedDate).append(element);
// }
//
// function addDetailsToUI(key, question, answer) {
//     var contentId = key + "content";
//     var contentIdentifier = "#" + key + "content";
//     var element = `<article>
//                                 <div class=\"panel panel-default\">
//                                     <div class=\"heading panel-heading\" data-toggle=\"collapse\" href=${contentIdentifier}>
//                                         <h2><a> ${question}</a></h2>
//                                     </div>
//                                     <div class=\"content panel-collapse collapse\" id = ${contentId} >
//                                             <article>
//                                                 <div> <p align=\"justify\">${answer}</p></div>
//                                             </article>
//                                     </div>
//                                 </div>
//                      </article>
//                   `;
//
//     $(".main-content").prepend(element);
// }
//