const clientId = 'Iv1.e4403e1079f73e03';
const clientSecret = 'f0e15bb39984b3fa5d4576e9e2d7e02e48390bfd';
const token = '76c4d1eab10dec5d5d3a93e8d3886d3c95a21967';

const input = document.querySelector("#search");
const button = document.querySelector(".search-button");
const starsList = document.querySelector(".most-stars");
const forksList = document.querySelector(".most-forks");
const contribsList = document.querySelector(".most-contribs");
const extList = document.querySelector(".top-ext");
const intList = document.querySelector(".top-int");

const fetchOrg = async (org) => {
  const orgCall = await fetch(`https://api.github.com/orgs/${org}/repos?access_token=${token}`);

  const orgData = await orgCall.json();
  // console.log(`org data:, `, orgData)

  orgData.forEach(forEachFunc);


  console.log((orgData));
  return { orgData };
};

const forEachFunc = async repo => {
  let { length, dataJson } = await contribRepoData(repo);
  repo['contribNum'] = length;
  repo['topContributors'] = dataJson.slice(0, 5);
}

const contribRepoData = async repo => {
  const data = await fetch(`${repo.url}/contributors?access_token=${token}`);
  const dataJson = await data.json();

  return { length: dataJson.length, dataJson };
};


const displayData = async () => {
  fetchOrg(input.value)
    .then(res => {
      let topStars, topForks, topContribs;

      topStars = res.orgData.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
      topForks = res.orgData.sort((a, b) => b.forks - a.forks).slice(0, 5);
      topContribs = res.orgData.sort((a, b) => b.contribNum - a.contribNum).slice(0, 5);

      console.log('topCONTRIBS', topContribs)
      // console.log(topStars);

      topStars.forEach((org, idx) => {
        let topStar = document.createElement("li");
        topStar.innerHTML = `${org.name}, ${org.stargazers_count}`;


        starsList.appendChild(topStar);
      });

      topForks.forEach((org, idx) => {
        let topFork = document.createElement("li");
        topFork.innerHTML = `${org.name}, ${org.forks}`;

        forksList.appendChild(topFork);
      });

      topContribs.forEach((org, idx) => {
        let topContrib = document.createElement("li");
        topContrib.innerHTML = `${org.name}`;

        contribsList.appendChild(topContrib);
      });

      (res.orgData.topContributors)
        .then(contributors => {
          return contributors.forEach(contributor => {
            let contrib = document.createElement("li");
            contrib.innerHTML = `${contributor.login}`;

            extList.appendChild(contrib);
          });
        });
    });
};

button.addEventListener("click", () => displayData());