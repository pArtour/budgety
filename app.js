//BUDGET CONTROLLER
const budgetController = (function () {
  class Expense {
    constructor(id, description, value) {
      this.id = id,
      this.description = description,
      this.value = value
    }
  };
  class Income {
    constructor(id, description, value) {
      this.id = id,
        this.description = description,
        this.value = value
    }
  };

  function calculateTotal(type) {

    let sum = 0;

    data.allItems[type].forEach(item => sum += item.value);
    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem(type, des, val) {
      let newItem, id;
      // Crerate new id
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }
      // create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(id, des, val)
      } else {
        newItem = new Income(id, des, val)
      }
      // Push it into our data structure
      data.allItems[type].push(newItem);

      return newItem;
    },

    calculateBudget() {
      // calc total income and epxenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calc th budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
        if (data.totals.inc > 0) {
          // calc the % of income that we spent
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
          data.percentage = -1;
        }
      
    },

    getBudget() {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing() {
      return data;
    }
  };
})();


//UI controller modeule
const UIController = (function () {

  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputAddBtn: '.add__btn',
    incomeBlock: '.income__list',
    expensesBlock: '.expenses__list',
    budgetLabel: '.budget__value',
    budgetIncomeLabel: '.budget__income--value',
    budgetExpensesLabel: '.budget__expenses--value',
    budgetPercentageLabel: '.budget__expenses--percentage'
  }

  return {
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // inc. or exp.
        description :document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },

    addListItem(obj, type) {
      let html, elem;
      // Create HTML string with placeholdeer text
      if (type === 'inc') {
        elem = DOMStrings.incomeBlock;
        html =
            `<div class="item clearfix" id="income-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
              </div>`;
      } else if (type === 'exp') {
        elem = DOMStrings.expensesBlock;
        html = 
            `<div class="item clearfix" id="expense-${obj.id}">
              <div class="item__description">${obj.description}</div>
              <div class="right clearfix">
                  <div class="item__value">${obj.value}</div>
                  <div class="item__percentage">21%</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
            </div>`;
      }
      document.querySelector(elem).insertAdjacentHTML('beforeend', html);
    },

    clearFields() {
      const fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      const fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(field => {
        field.value = '';
      });
      fieldsArray[0].focus();
    },

    displayBudget(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.budgetIncomeLabel).textContent = obj.totalIncome;
      document.querySelector(DOMStrings.budgetExpensesLabel).textContent = obj.totalExpenses;
      
      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.budgetPercentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.budgetPercentageLabel).textContent = '---';
      }
    },

    getDOMStrings() {
      return DOMStrings;
    }
  };
})();


// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  
   function setupEventListeners() {
    
    const DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputAddBtn).addEventListener('click', controllAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) { //fot old browesers 'which'
        controllAddItem();
      }
    });
  };

  function updateBudget() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    const budget = budgetCtrl.getBudget();
    // 3. Diaplay the budget on the UI
    UIController.displayBudget(budget)
    
  }  

  function controllAddItem() {
    // 1. Get the field input data
    const input = UICtrl.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the ite to the budget controller
      const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear fields
      UICtrl.clearFields();
      // 5. Calculate and update budget  
      updateBudget();
    }
  }

  return {
    init() {
      console.log('App started working');
      UIController.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();

//Сюда пишу все шаги. потом эти коменты стоит удаалить
// 1. Разбил архитектуру проекта на 3 модуля 3 (IIEF): budgetController, UIController и controller
// 2. Event по нажатию кнопки add__btn или по клавише Enter
// 3. Возвращаем с помощью метода getInput значения интпутов
// 4. Создаем объект для хранения строк с классами html элементов
// 5. setupEventListeners --- инициализирует events
// 6. init --- инициализация приложения
// 7. Store income and expence in budget controller: 
//   ---Класс для объектов expences и income
//   ---Объект data для хранения всех данных
// 8. AddItem --- Добавляет новый объект с помощью классов в массивы объекта data
// 9. Добавляем newItem на UI + очищение инпутов + фокус на 1 элемент
// 10. Calculate all incomes & expenses, calc total budget (inc - exp) & percentage
// 11. Display budget updating on webpage (html)
// 12. 