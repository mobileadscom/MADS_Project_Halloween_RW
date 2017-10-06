/* global window, Image, Math */
import Mads, { fadeOut, fadeIn } from 'mads-custom';
import Scratchcard from 'scratchcard';
import './main.css';

class AdUnit extends Mads {
  render() {
    return `
      <div class="container" id="ad-container">
        <div id="ad-content">
          <img src="${this.data.headline}" id="headline">
          <img src="${this.data.lblSwipe}" id="swipe">
          <img src="${this.data.hand}" id="hand">
          <img src="${this.data.title}" id="title">
        </div>
        <img src="${this.data.btnBook}" id="book">
        <img src="${this.data.bgScratched}" class="bg" id="bg">
        <img src="${this.data.bgDetailed}" class="bg" id="details">
        <div class="preloaders">
          <div id="bgDark-preload"></div>
          <div id="bgScratched-preload"></div>
          <div id="bgDetailed-preload"></div>
        </div>
      </div>
    `;
  }

  style() {
    return [
      `
      #bgDark-preload { background: url(${this.data.bgDark}) no-repeat -9999px -9999px; }
      #bgScratched-preload { background: url(${this.data.bgScratched}) no-repeat -9999px -9999px; }
      #bgDetailed-preload { background: url(${this.data.bgDetailed}) no-repeat -9999px -9999px; }
      `];
  }

  events() {
    const sc = new Scratchcard(this.elems['ad-content'], {
      painter: {
        thickness: 100,
      },
    });
    const canvas = sc.getCanvas();
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = this.resolve(this.data.bgDark);
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 1, 0);
    };
    const wrapper = sc.getWrapper();
    wrapper.addEventListener('mousedown', () => {
      fadeOut(this.elems.swipe);
      fadeOut(this.elems.hand);
    });

    this.elems.book.addEventListener('mousedown', () => {
      this.tracker('E', 'landing');
      this.linkOpener('http://www.halloweenhorrornights.com.sg/tickets');
    });

    sc.on('progress', (progress) => {
      if (Math.floor(progress * 100) >= 50) {
        wrapper.style.opacity = 1;
        setTimeout(() => {
          wrapper.style.transition = 'opacity 0.4s';
          wrapper.style.opacity = 0;
          fadeIn(this.elems.details, 'block');
          fadeIn(this.elems.book, 'block');
          this.tracker('E', 'scratched');
        }, 10);
        setTimeout(() => {
          wrapper.style.display = 'none';
        }, 400);
      } else {
        fadeIn(this.elems.swipe, 'block');
        fadeIn(this.elems.hand, 'block');
      }
    });
  }
}

window.ad = new AdUnit();
