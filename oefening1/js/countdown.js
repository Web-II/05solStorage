class Milestone {
  constructor(name, date) {
    this.name = name;
    this.date = date;
  }
  get name() {
    return this._name;
  }
  get date() {
    return this._date;
  }
  set name(value) {
    this._name = value;
  }
  set date(value) {
    this._date = value;
  }
}

class MilestonesComponent {
  constructor(storage) {
    this._storage = storage;
    this._milestones = [];
  }
  get storage() {
    return this._storage;
  }
  get milestones() {
    return this._milestones;
  }
  calculateDiffDays(d) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.ceil(Math.abs((new Date().getTime() - new Date(d).getTime()) / oneDay));
  }
  addMilestone(name, date) {
    if (name === '' || name === null || date === null) alert("Name/Date milestone required");
    else if (new Date(date) < new Date()) alert("This milestone is today or already in the past and isn't added");
    else {
      this._milestones.push(new Milestone(name, date));
      this.setMilestonesInStorage();
      this.toHTML();
    }
  }
  deleteMilestone(ind) {
    this._milestones.splice(ind, 1);
    this.setMilestonesInStorage();
    this.toHTML();
  }
  clearMilestones() {
    this._milestones = [];
    this._storage.removeItem('milestones');
    this.toHTML();
  }
  toHTML() {
    document.getElementById('overview').innerHTML = '';
    this._milestones.map((m, ind) => {
      const li = document.createElement('li');
      li.setAttribute('class', 'list-group-item col-sm-8');
      li.appendChild(
        document.createTextNode(
          this.calculateDiffDays(m.date) + ' days left until ' + m.name
        )
      )
      const btn = document.createElement('button');
      btn.setAttribute('class', 'btn btn-default');
      btn.setAttribute('style', 'margin-left:20px')
      btn.innerText = "-";
      btn.addEventListener('click', () => {
        this.deleteMilestone(ind)
      });
      li.appendChild(btn);
      document.getElementById('overview').appendChild(li);
    });
  }
  getMilestonesFromStorage() {
    this._milestones = [];
    const mA = this._storage.getItem('milestones')
    if (mA) {
      this._milestones = JSON.parse(mA).map(m => new Milestone(m._name, m._date));
      this._milestones = this._milestones.filter(m => this.calculateDiffDays(m._date) >= 0);
    }
  }
  setMilestonesInStorage() {
    this._milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
    this._storage.setItem('milestones', JSON.stringify(this._milestones));
  }
}

function init() {
  const milestonesComponent = new MilestonesComponent(this.localStorage);
  const addButton = document.getElementById('add');
  const clearButton = document.getElementById('clear');
  const nameText = document.getElementById('name');
  const dateText = document.getElementById('date');

  if (!milestonesComponent.storage) {
    //browser ondersteunt geen storage
    alert('no storage available. ');
    addButton.disabled = true;
    clearButton.disabled = true;
    return;
  }

  milestonesComponent.getMilestonesFromStorage();
  milestonesComponent.toHTML();

  addButton.onclick = () => {
    milestonesComponent.addMilestone(nameText.value, dateText.value);
    nameText.value = '';
  };

  clearButton.onclick = () => {
    milestonesComponent.clearMilestones();
  };
}
window.onload = init;