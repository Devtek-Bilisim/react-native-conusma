export declare class MediaServerModel {
    Id: number;
    Name: string;
    Type: string;
    ConnectionIpAddress: string;
    ConnectionDnsAddress: string;
    Port: string;
    MediaServerType: boolean;
    State: string;
    Latitude: string;
    Longitude: string;
    CpuLimit: number;
    BandwidthRxLimit: number;
    BandwidthTxLimit: number;
    MemoryLimit: number;
    ActiveCpu: number;
    ActiveBandwidthRx: number;
    ActiveBandwidthTx: number;
    ActiveUseMemory: number;
    ActiveTotalMemory: number;
    ActiveConnectionCount: number;
    ActiveTotalConsumerCount: number;
    ActiveTotalProducerCount: number;
    ActiveVideoProducerCount: number;
    ActiveAuidoProducerCount: number;
}
