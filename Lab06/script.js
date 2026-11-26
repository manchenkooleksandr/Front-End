const button = document.getElementById('load');
const status = document.getElementById('status');
const profile = document.getElementById('profile');
const portrait = document.getElementById('portrait');
const fields = document.getElementById('fields');

function showProfile(user) {
  const image = new URL(user.picture.large);
  if (image.protocol !== 'https:' || image.origin !== 'https://randomuser.me') {
    throw new Error('Неочікувана адреса аватара');
  }
  const rows = [
    ['Електронна пошта', user.email],
    ['Ім’я', [user.name.first, user.name.last].join(' ')],
    ['Телефон', user.phone],
    ['Місто', user.location.city],
  ];
  if (rows.some(([, value]) => typeof value !== 'string' || !value.trim())) {
    throw new Error('Некоректні поля у відповіді API');
  }
  const img = new Image(128, 128);
  img.alt = 'Аватар з Random User API';
  img.src = image.href;
  portrait.replaceChildren(img);
  fields.replaceChildren(...rows.flatMap(([label, value]) => {
    const term = document.createElement('dt');
    const data = document.createElement('dd');
    term.textContent = label;
    data.textContent = value;
    return [term, data];
  }));
  profile.hidden = false;
}

button.addEventListener('click', () => {
  button.disabled = true;
  profile.hidden = true;
  status.textContent = 'Завантаження…';
  fetch('https://randomuser.me/api/?inc=picture,email,name,phone,location', {
    signal: AbortSignal.timeout(15000),
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(result => {
      showProfile(result.results[0]);
      status.textContent = 'Профіль завантажено.';
    })
    .catch(() => {
      status.textContent = 'Не вдалося завантажити профіль. Спробуйте ще раз.';
    })
    .finally(() => {
      button.disabled = false;
    });
});
