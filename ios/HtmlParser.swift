import Foundation
import SwiftSoup

@objc(HtmlParser)
class HtmlParser: NSObject {
  enum VALID_RETURN_TYPE: String { case StringOfArray, IntOfArray, String, Int, Boolean }
  typealias Item = (field: String, value: String, type: VALID_RETURN_TYPE, separater: Character)
  
  let RETURN_TYPE = "type"
  let FIELD = "field"
  let CSS_SELECTOR = "selector"
  let MORE_CSS_SELECTOR = "moreSelector"
  let SEPARATER = "separator"
  let ATTRIBUTE = "attribute"
  let RESULT = "result"
  let DEFAULT_SEPARATER: Character = " "
  
  
  
  @objc
  func test(_ url: String, schema: NSDictionary) -> Void {
    print(url)
  }
  
  
  @objc(getMyPromise:resolver:rejecter:)
          func getMyPromise(_ someValue: Bool,
              resolver resolve: RCTPromiseResolveBlock,
              rejecter reject:RCTPromiseRejectBlock) -> Void {
          resolve(true)
      }
  
  /**
     Schema:
      [{
          field: "title",
          type: "array<string>/string/int/boolean",
          selector: ".calssname",
              result:"array<string>/string/int/boolean",
      }]
   
      Return
      [{
        field: "ttile"
        result: "array<string>/string/int/boolean"
   }]
   */

  @objc(parse:schemas:resolver:rejecter:)
  func parse(_ url: String, schemas: [[String:String]], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    parse( url, schemas:schemas, base: "", resolve: resolve, reject: reject)
  }
  
  @objc(parse:schemas:base:resolver:rejecter:) // make the signature (label) be same with the on declared in ObjectiveC
  func parse(_ url: String, schemas: [[String:String]], base: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    print("url is ===> \(url)")
    // TODO validate the schemas
    var parsedItems: [String:[Item]] = [:]
    var ret: [[String: Any]] = [[:]]

    do {
      let document: Document = try getDoc(url: url)
      if (!document.hasText()) {
        print("No document found")
        let err = NSError(domain: "Result", code: -1, userInfo: nil);
        reject("Html Parse Error", "No document found", err);
        return
      }
      var items: [Item] = []
      for schema in schemas {
        let field = schema[FIELD]
        items = try read(doc:document, schema: schema)
        parsedItems[field!] = items
      }
    } catch let error {
      // print error
      let err = NSError(domain: "Result", code: -1, userInfo: nil);
      reject("Html Parse Error", error.localizedDescription, err);
      return
    }
    
    // normalize returns
    if (!parsedItems.isEmpty) {
      var size: Int = 0
      if (base == "") {
        size = parsedItems[parsedItems.keys.first!]!.count
      } else {
        size = parsedItems[base]!.count
      }
      ret = normalizeResult(fields: parsedItems, count: size)
      resolve(ret)
      return
    }
    resolve([])
  }
  
  func getDoc(url: String) throws -> Document {

    var document: Document = Document.init("")
    guard let rUrl = URL(string: url) else {
      return document;
    }
    do {
      let html = try String.init(contentsOf: rUrl)
      document = try SwiftSoup.parse(html)
    } catch let error {
      print(error.localizedDescription)
      throw error
    }
    return document
  }
  
  func read(doc: Document, schema: [String:String]) throws -> [Item] {
    let cssSelector: String = schema[CSS_SELECTOR]!
    let field = schema[FIELD]
    let attr = schema[ATTRIBUTE]
    let more = schema[MORE_CSS_SELECTOR]
    let separater = schema[SEPARATER]
    var chosenSeparater: Character
    var items: [Item] = []
    do {
      let elements: Elements = try doc.select(cssSelector) // get from schema
      for element in elements {
        var text: String = ""
        if (attr != nil) {
          text = try element.attr(attr!).trimmingCharacters(in: .whitespacesAndNewlines)
        } else if (more != nil) {
          text = try element.select(more!).text()
        } else {
          text = try element.text() // get content
        }
        let type = VALID_RETURN_TYPE.init(rawValue: schema[RETURN_TYPE]!)
        if (separater == nil) {
          chosenSeparater = DEFAULT_SEPARATER
        } else {
          chosenSeparater = Character.init(separater!)
        }
        let item = Item(field: field!, value: text, type: type!, separater: chosenSeparater)
        items.append(item)
      }
    } catch let error {
      print(error.localizedDescription)
      throw error
    }
    
    return items
  }
  
  
  /**
     [{
      title: "",
      pos: "",
      houseInfo: "",
      followInfo: "",
      totalPrice: "",
      unitPrice: "",
      tags: "sss\nddd"
      houseImg: "",  // URL
      detailLink: "" // URL
     }]
       [""] // houseImgUrls
   
   
   [{title: ["aa","cc", "dd"]}, price: [2,6,7], pos: ["zzz", "sss", "fff"]] => [{title: "aa", price: 2, pos: "zzz" }...]
   */
  
  
  
  func normalizeResult(fields: [String: [Item]], count: Int) -> [[String:Any]] {
    var ret:[[String:Any]] = [];
    // find base items
    for n in 0...(count-1) {
      var retItem: [String: Any] = [:]
      
      for (field, values) in fields {
        // title
        retItem[field] = normalizeValue(item: values[n])
      }
      ret.append(retItem)
    }
    return ret
  }

  func normalizeValue(item: Item) -> Any {
  var ret: Any = item.value
    switch item.type {
      case .StringOfArray:
        let values = item.value.split(separator: item.separater)
        ret = values
        break
      case .IntOfArray:
        // TODO
        break
      case .Int:
        ret = (item.value as NSString).intValue
        break
      case .Boolean:
        // TODO
        break
      case .String:
        break
      default:
        break
    }
  
  return ret
}

//  func findValue(cells: [[String:Any]], field: String) -> [String: Any] {
//    for cell in cells {
//
//    }
//  }
}
