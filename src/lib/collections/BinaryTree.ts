interface TreeNodeInterface<V> {
    value: V|null;
    left: TreeNodeInterface<V>;
    right: TreeNodeInterface<V>;
}

export class BinaryTree<V> {
    private root: TreeNodeInterface<V> | null;

    
}