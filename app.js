const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>
{
    console.log(entry)
    if (entry.isIntersecting)
    {
        entry.target.classList.add('show');

    }
    else
    {
        entry.target.classList.remove('show');
    }
});
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

document.getElementById('explorenowbtn').addEventListener('click', function () {
    const aboutMeBox = document.getElementById('content1');
    aboutMeBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });