import {Injectable} from '@angular/core';
import {Api} from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class BbCodeService {
  private bbcodeMatches = [];
  private htmlTpls = [];
  private tokens = {
    URL : '((?:(?:[a-z][a-z\\d+\\-.]*:\\/{2}(?:(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+|[0-9.]+|\\[[a-z0-9.]+:[a-z0-9.]+:[a-z0-9.:]+\\])(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)|(?:www\\.(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)))',
    LINK : '([a-z0-9\-\./]+[^"\' ]*)',
    EMAIL : '((?:[\\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*(?:[\\w\!\#$\%\'\*\+\-\/\=\?\^\`{\|\}\~]|&)+@(?:(?:(?:(?:(?:[a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(?:\\d{1,3}\.){3}\\d{1,3}(?:\:\\d{1,5})?))',
    TEXT : '(.*?)',
    SIMPLETEXT : '([a-zA-Z0-9-+.,_ ]+)',
    INTTEXT : '([a-zA-Z0-9-+,_. ]+)',
    IDENTIFIER : '([a-zA-Z0-9-_]+)',
    COLOR : '([a-z]+|#[0-9abcdef]+)',
    NUMBER  : '([0-9]+)'
  };
  private tokenMatch = /{[A-Z_]+[0-9]*}/ig;

  constructor() {
    this.addBBCode('[b]{TEXT}[/b]', '<strong>{TEXT}</strong>');
    this.addBBCode('[i]{TEXT}[/i]', '<em>{TEXT}</em>');
    this.addBBCode('[url]{URL}[/url]', '<a href="{URL}" title="link" target="_blank">{URL}</a>');
  }

  preg_quote(str, delimiter = '') {
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter) + '-]', 'g'), '\\$&');
  }

  _getRegEx(str) {
    const matches = str.match(this.tokenMatch);
    let replacement = '';

    if (matches.length <= 0) {
      return new RegExp(this.preg_quote(str), 'g');        // no tokens so return the escaped string
    }

    for (let i = 0; i < matches.length; i += 1) {
      // Remove {, } and numbers from the token so it can match the
      // keys in tokens
      const token = matches[i].replace(/[{}0-9]/g, '');

      if (this.tokens[token]) {
        // Escape everything before the token
        replacement += this.preg_quote(str.substr(0, str.indexOf(matches[i]))) + this.tokens[token];

        // Remove everything before the end of the token so it can be used
        // with the next token. Doing this so that parts can be escaped
        str = str.substr(str.indexOf(matches[i]) + matches[i].length);
      }
    }

    replacement += this.preg_quote(str);      // add whatever is left to the string

    return new RegExp(replacement, 'gi');
  }
  _getTpls(str) {
    const matches = str.match(this.tokenMatch);
    let replacement = '';
    const positions = {};
    let nextPosition = 0;

    if (matches.length <= 0) {
      return str;       // no tokens so return the string
    }

    for (let i = 0; i < matches.length; i += 1) {
      // Remove {, } and numbers from the token so it can match the
      // keys in tokens
      const token = matches[i].replace(/[{}0-9]/g, '');
      let position;

      // figure out what $# to use ($1, $2)
      if (positions[matches[i]]) {
        position = positions[matches[i]];         // if the token already has a position then use that
      } else {
        // token doesn't have a position so increment the next position
        // and record this token's position
        nextPosition += 1;
        position = nextPosition;
        positions[matches[i]] = position;
      }

      if (this.tokens[token]) {
        replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
        str = str.substr(str.indexOf(matches[i]) + matches[i].length);
      }
    }

    replacement += str;

    return replacement;
  }
  addBBCode(bbcodeMatch, bbcodeTpl) {
    // add the regular expressions and templates for bbcode to html
    this.bbcodeMatches.push(this._getRegEx(bbcodeMatch));
    this.htmlTpls.push(this._getTpls(bbcodeTpl));
  }

  public bbcodeToHtml(bbcode: string): string {
    bbcode = bbcode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    for (let i = 0; i < this.bbcodeMatches.length; i += 1) {
      bbcode = bbcode.replace(this.bbcodeMatches[i], this.htmlTpls[i]);
    }

    return bbcode;
  }

}
