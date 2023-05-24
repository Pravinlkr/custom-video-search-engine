// overlay script
const logo = document.getElementById("engine-logo");
const resultOverlay = document.getElementById("result-overlay");
const videoIframe = document.getElementById("videoIframe");
const detailsTitle = document.getElementById("details-title");
const detailsUrl = document.getElementById("details-url");
const detailsViewsCount = document.getElementById("details-views-count");
const visitButton = document.getElementById("visit-link");
const closeButton = document.getElementById("close-overlay");

let visitSelectedVideoUrl = '';

const openResutOverlay = () => {
  resultOverlay.classList.add('show-animated');
  resultOverlay.classList.add('show-overlay');
  if(resultOverlay.classList.contains("hide-animated")) {
    resultOverlay.classList.remove('hide-animated');
  }
};

visitButton.addEventListener('click', ()=> {
  window.open(visitSelectedVideoUrl, '_blank')
})

closeButton.addEventListener('click', () => {
  resultOverlay.classList.add('hide-animated');
  resultOverlay.classList.remove('show-animated');
  resultOverlay.classList.remove('show-overlay');
  visitSelectedVideoUrl = ''
  videoIframe.setAttribute("src", '');
  detailsTitle.innerHTML = '';
  detailsUrl.innerText = '';
  detailsViewsCount.innerText = '';
  window.onscroll=function(){};
})


// formate views count from number to K, M, B
const formatViewsCount = (views) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return `${views ? formatter.format(views) : 0} views`
}

// truncate the video title to 50 characters
const truncate = (input, count) => {
  if (input.length > count) {
     return input.substring(0, count) + '...';
  }
  return input;
};

// show video overlay once clicked on any video
function resultBoxClicked(result) {
  window.scrollTo(0, 0);
  window.onscroll = function () { window.scrollTo(0, 0)};
  videoIframe.setAttribute("src", result.richSnippet.videoobject.embedurl);
  detailsTitle.innerHTML = truncate(result['title'], 100);
  detailsUrl.innerText = result['visibleUrl'].replace('www.', '');
  detailsViewsCount.innerText = formatViewsCount(result.richSnippet.videoobject.interactioncount);
  visitSelectedVideoUrl = result.richSnippet.videoobject.url;
  openResutOverlay();
}

// result callback called once search is perfomed
const myResultsReadyCallback = function(name, q, promos, results, resultsDiv) {

  // create single video element thumbnail image, url, views etc
  const makeResultParts = (result) => {
    const thumbnailImg = document.createElement('img');
    thumbnailImg.classList.add('thumbnail-image')
    thumbnailImg.src = result.thumbnailImage ? result.thumbnailImage?.url : './images/videodefault.png';
    const infoBox = document.createElement('div');

    const anchor = document.createElement('a');
    anchor.href = result['url'];
    anchor.target = '_blank';
    anchor.appendChild(document.createTextNode(result['visibleUrl'].replace('www.', '')));

    const titleText = document.createElement('div');
    titleText.className = 'video-title'
    titleText.innerHTML = truncate(result['title'], 50);

    const viewsText = document.createElement('p');
    viewsText.className = 'views-text';
    viewsText.innerText = formatViewsCount(result.richSnippet.videoobject.interactioncount);

    infoBox.appendChild(titleText);
    infoBox.appendChild(document.createElement('br'));
    return [thumbnailImg, infoBox, viewsText, anchor];
  };

  if (results) {
    // create custom look for video results
    for (const result of results) {
        const singleResultContiner = document.createElement('div');
        singleResultContiner.className = 'result-container';
        singleResultContiner.addEventListener('click', resultBoxClicked.bind(this, result));

        const videoContiner = document.createElement('div');
        videoContiner.className = 'video-container';

        const duration = document.createElement('div');
        duration.className = 'duration';
        videoContiner.appendChild(duration);

        const detailContiner = document.createElement('div');
        detailContiner.className = 'detail-container';

        const resultBottomSection = document.createElement('div');
        resultBottomSection.className = 'result-bottom-section';

        const [thumbnailImg, infoBox, viewsText, anchor] = makeResultParts(result);

        videoContiner.appendChild(thumbnailImg);
        resultBottomSection.appendChild(anchor);
        resultBottomSection.appendChild(viewsText);
        detailContiner.appendChild(infoBox);
        detailContiner.appendChild(resultBottomSection);

        singleResultContiner.appendChild(videoContiner);
        singleResultContiner.appendChild(detailContiner);
        resultsDiv.appendChild(singleResultContiner);
      }
  }
  return true;
};

const myInitCallback = function() {
  if (document.readyState == 'complete') {
    google.search.cse.element.render(
        {
          div: "search-box-container",
          tag: 'search'
          });
  } else {
    google.setOnLoadCallback(function() {
        google.search.cse.element.render(
            {
              div: "search-box-container",
              tag: 'search'
            });
    }, true);
  }
};

(window.__gcse = {
  parsetags: 'explicit',
  initializationCallback: myInitCallback,
}) || window.__gcse;

window.__gcse.searchCallbacks = {
  web: {
    ready: myResultsReadyCallback,
  },
};

window.onload = (() => {
  // modify placeholder and style for search box
  const inputBox = document.getElementById("gsc-i-id1");
  inputBox.placeholder = 'Search...';
  inputBox.style.paddingLeft = '0.5rem';
})

