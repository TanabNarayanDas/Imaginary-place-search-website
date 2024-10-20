console.log("working!");

function submit(){

    //taking input from user and storing it in input variable
    const inputField = document.getElementById('userInput');
    const input = inputField.value;
    if(input==""){
        inputField.classList.add('error');
        setTimeout(() => {
            inputField.classList.remove('error');
        }, 400);
        return;
    }else{
        inputField.classList.remove('error');
        fetch('/generate', {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //coverting to json
        body: JSON.stringify({ prompt: input })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //this is the other way(method 2)
            console.log(data[0].locationName);
            console.log(data[0].urls);//array
            let k=1,j=0;
            for (let i = 0; i < 3; i++) {
                 if (data[i]) {
            
                     document.querySelector(`.loc${k}`).innerText = data[i].locationName;
                     document.getElementById(`photo${k}`).src = data[0].urls[i];
                     k++;
                }
             }
             for (let i = 0; i < 3; i++) {
                if (data[i]) {
           
                    document.querySelector(`.loc${k}`).innerText = data[i].locationName;
                    document.getElementById(`photo${k}`).src = data[1].urls[i];
                    k++;
               }
            }
            for (let i = 0; i < 3; i++) {
                if (data[i]) {
                    document.querySelector(`.loc${k}`).innerText = data[i].locationName;
                    document.getElementById(`photo${k}`).src = data[2].urls[i];
                    k++;
               }
            }
        })
        .catch(error => {
        console.error('Error:', error);
        });
    }
}