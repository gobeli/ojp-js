import { TreeNode } from "../xml/tree-node"

// OJP reference - these are the same?
//  - 8.4.5.2 StopPoint Structure
//  - 8.4.5.3 StopPlace Structure
type StopType = 'StopPlace' | 'StopPoint'

export class StopPlace {
  public stopPlaceRef: string
  public stopPlaceName: string
  public topographicPlaceRef: string | null
  public stopType: StopType

  constructor(stopPlaceRef: string, stopPlaceName: string, topographicPlaceRef: string | null,  stopType: StopType = 'StopPlace') {
    this.stopPlaceRef = stopPlaceRef
    this.stopPlaceName = stopPlaceName
    this.topographicPlaceRef = topographicPlaceRef
    this.stopType = stopType
  }

  public static initWithLocationTreeNode(locationTreeNode: TreeNode): StopPlace | null {
    let stopType: StopType = 'StopPlace';

    let stopPlaceRef = locationTreeNode.findTextFromChildNamed('ojp:StopPlace/ojp:StopPlaceRef');
    let stopPlaceName = locationTreeNode.findTextFromChildNamed('ojp:StopPlace/ojp:StopPlaceName/ojp:Text') ?? '';
    let topographicPlaceRef = locationTreeNode.findTextFromChildNamed('ojp:StopPlace/ojp:TopographicPlaceRef');

    // Try to build the StopPlace from StopPoint
    if (stopPlaceRef === null) {
      stopType = 'StopPoint';
      stopPlaceRef = locationTreeNode.findTextFromChildNamed('ojp:StopPoint/siri:StopPointRef');
      stopPlaceName = locationTreeNode.findTextFromChildNamed('ojp:StopPoint/ojp:StopPointName/ojp:Text') ?? '';
      topographicPlaceRef = locationTreeNode.findTextFromChildNamed('ojp:StopPoint/ojp:TopographicPlaceRef');
    }

    // Otherwise try to see if we have a single siri:StopPointRef node
    if (stopPlaceRef === null) {
      stopType = 'StopPoint';
      stopPlaceRef = locationTreeNode.findTextFromChildNamed('siri:StopPointRef');
    }

    if (stopPlaceRef === null) {
      return null;
    }

    const stopPlace = new StopPlace(stopPlaceRef, stopPlaceName, topographicPlaceRef, stopType);

    return stopPlace;
  }

  public static initWithServiceTreeNode(treeNode: TreeNode, pointType: 'Origin' | 'Destination'): StopPlace | null {
    const stopPlaceRef = treeNode.findTextFromChildNamed('ojp:' + pointType + 'StopPointRef');
    const stopPlaceText = treeNode.findTextFromChildNamed('ojp:' + pointType + 'Text/ojp:Text');

    if (!(stopPlaceRef && stopPlaceText)) {
      return null;
    }

    const stopPlace = new StopPlace(stopPlaceRef, stopPlaceText, null, 'StopPlace');
    return stopPlace;
  }
}
