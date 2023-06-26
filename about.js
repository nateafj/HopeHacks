//home slider page

const productContainers = document.querySelectorAll('.team-member');
const nxtBtn = document.querySelectorAll('.nxt-btn');
const preBtn = document.querySelectorAll('.pre-btn');
//line 2 selects all the elements in the product container and stores them in the variable
//line 3-4 selects the elements in the nxt/pre button and stores them in their own vairable
productContainers.forEach(function(item, i) { //loops through each product container with this function
  const containerDimensions = item.getBoundingClientRect(); //this would get the dimensions of each container
  const containerWidth = containerDimensions.width; //this would get the width

  nxtBtn[i].addEventListener('click', function() { //event listeners for the click on the button
    item.scrollLeft += containerWidth; //when button is clicked it would scroll button to the right
  });  
  preBtn[i].addEventListener('click', function() { //event listners for the click on the button
    item.scrollLeft -= containerWidth; //when button is click it would scroll button to the left
  });
});
