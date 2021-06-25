export class MediaServerModel {
    public Id:number;
    public Name:string = "";
    public Type:string = "";
    public ConnectionIpAddress:string = "";
    public ConnectionDnsAddress:string = "";
    public Port:string = "";
    public MediaServerType:boolean = false;
    public State:string = "";
    public Latitude:string = "";
    public Longitude:string = "";
    public CpuLimit:number;
    public BandwidthRxLimit:number;
    public BandwidthTxLimit:number;
    public MemoryLimit:number;
    public ActiveCpu:number;
    public ActiveBandwidthRx:number;
    public ActiveBandwidthTx:number;
    public ActiveUseMemory:number;
    public ActiveTotalMemory:number;
    public ActiveConnectionCount:number;
    public ActiveTotalConsumerCount:number;
    public ActiveTotalProducerCount:number;
    public ActiveVideoProducerCount:number;
    public ActiveAuidoProducerCount:number;
   
}
