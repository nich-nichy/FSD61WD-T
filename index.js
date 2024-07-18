const countdownElement = document.getElementById("count");

setTimeout(() => {
  countdownElement.innerText = "9";
  setTimeout(() => {
    countdownElement.innerText = "8";
    setTimeout(() => {
      countdownElement.innerText = "7";
      setTimeout(() => {
        countdownElement.innerText = "6";
        setTimeout(() => {
          countdownElement.innerText = "5";
          setTimeout(() => {
            countdownElement.innerText = "4";
            setTimeout(() => {
              countdownElement.innerText = "3";
              setTimeout(() => {
                countdownElement.innerText = "2";
                setTimeout(() => {
                  countdownElement.innerText = "1";
                  setTimeout(() => {
                    countdownElement.innerText = "Happy Independence Day!";
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
