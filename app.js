//Module event handler
const budgetController = (function () {




  return {
    publicTest(b) {
      console.log(b);
      
    }
  }



})();


//UI controller modeule
const UIController = (function () {
  

})();



const controller = (function (budgetCtrl, UICtrl) {
  
  budgetCtrl.publicTest('Mal')

})(budgetController, UIController);