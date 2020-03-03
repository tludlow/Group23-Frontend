import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import moment from "moment";
import { Link } from "react-router";

import api from "../../api"

export default function Report(props) {
    let date = moment(props.params.reportDate, "YYYY-MM-DD").format("dddd, MMMM Do YYYY")

    let year = props.params.reportDate.split("-")[0]
    let month = props.params.reportDate.split("-")[1]
    let day = props.params.reportDate.split("-")[2]

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [reportData, setReportData] = useState(null)

    useEffect(()=> {
        document.title = `CS261 - Report: ${year}-${month}-${day}`
        api.get(`/report/year=${year}&month=${month}&day=${day}/`).then(response => {
            console.log(response)
            setReportData(response.data)
            setLoading(false)
        }).catch(error => { 
            setError(error.message)
            setLoading(false)
            console.log(error)
        })
    }, [])

    if(error.length > 0) {
        return (
            <>
            <h3 className="text-red-700 font-semibold">Error!</h3>
            <p>{error}</p>
            </>
        );
    }

    if (loading) {
        return (
                <div className="h-48 w-48 mx-auto spinner text-center"></div>
        );
    } else {
        return (
            <div className="p-4" id="report-page">
                    <div className="">
                        <div className="flex flex-col md:flex-row justify-between">
                            <h2 className="text-brand font-bold text-2xl">{date}</h2>
                            <PDFDownloadLink
                                    document={<PDFDocument data={reportData}/>}
                                    fileName={`report-${year + "-" + month + "-" + day}.pdf`}
                                    style={{
                                        textDecoration: "none",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        color: "white",
                                        backgroundColor: "#4a5568"
                                    }}>
                                    {({ blob, url, loading, error }) =>
                                    loading ? "Loading PDF..." : "Download PDF"
                                    }
                            </PDFDownloadLink>
                        </div>
                        <p>Trading Summary (Click on a section title to jump to that section)</p>
                        <div className="mt-3">
                            <ul className="flex flex-col md:flex-row justify-between">
                                <li className="mt-2"><a className="px-4 py-1 bg-brand text-white rounded-full" href="#new-trades">New Trades: <span>{reportData.num_of_new_trades}</span></a></li>
                                <li className="mt-2"><a className="px-4 py-1 bg-brand text-white rounded-full" href="#edited-trades">Edited Trades: <span>{reportData.num_of_edited_trades}</span></a></li>
                                <li className="mt-2"><a className="px-4 py-1 bg-brand text-white rounded-full" href="#deleted-trades">Deleted Trades: <span>{reportData.num_of_deleted_trades}</span></a></li>
                                <li className="mt-2"><a className="px-4 py-1 bg-brand text-white rounded-full" href="#erroneous-trades">Erroneous Trades: <span>{reportData.erroneousTradeCount}</span></a></li>
                                <li className="mt-2"><a className="px-4 py-1 bg-brand text-white rounded-full" href="#user-corrected-trades">User Corrected Trades: <span>{reportData.userCorrectionsCount}</span></a></li>
                                <li className="mt-2"><a className="px-4 py-1 bg-brand text-white rounded-full" href="#system-corrected-trades">System Corrected Trades: <span>{reportData.systemCorrectionsCount}</span></a></li>
                            </ul>
                        </div>
                    </div>
                
    
                    <section className="mt-12" id="new-trades">
                        <h3 className="text-brand font-semibold text-lg">New Trades</h3>
                        <p>Trades created today</p>
                        
                        {reportData.num_of_new_trades > 0 &&
                        <div className="mt-3">
                            <table className="table-fixed rounded">
                                <thead>
                                    <tr>
                                        <th className="w-1/12 px-4 py-2">ID</th>
                                        <th className="w-1/12 px-4 py-2">Buying Party</th>
                                        <th className="w-1/12 px-4 py-2">Selling Party</th>
                                        <th className="w-1-12 px-4 py-2">Product</th>
                                        <th className="w-1-12 px-4 py-2">Quantity</th>
                                        <th className="w-1-12 px-4 py-2">Underlying Price</th>
                                        <th className="w-1-12 px-4 py-2">Strike Price</th>
                                        <th className="w-1-12 px-4 py-2">Currencies <small className="text-xs font-normal">(Underlying) | (Notional)</small></th>
                                        <th className="w-1-12 px-4 py-2">Maturity Date</th>
                                        <th className="w-1/12 px-4 py-2">Date</th>
                                        <th className="w-1/12 px-4 py-2">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reportData.created_trades.map((created_trade, index)=> (
                                        index % 2 === 0 ?
                                        <tr>
                                            <td className="border px-4 py-2 text-center">{created_trade.id}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.buying_party}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.selling_party}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.product}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.underlying_price}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.quantity}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.strike_price}</td>
                                            <td  className="border px-4 py-2 text-center">{created_trade.underlying_currency} | {created_trade.notional_currency}</td>
                                            <td className="border px-4 py-2 text-center">{moment(created_trade.maturity_date).fromNow()}</td>
                                            <td className="border px-4 py-2 text-center">{moment(created_trade.date).fromNow()}</td>
                                            <td className="border px-4 py-2">
                                                <Link className="mr-3 px-2 py-1 bg-blue-700 text-white rounded" to={`/trading/edit-trade/${created_trade.id}`}>Edit</Link>
                                                <Link className="ml-3 px-2 py-1 bg-red-700 text-white rounded" to={`/trading/delete-trade/${created_trade.id}`}>Delete</Link>
                                            </td>
                                        </tr>
                                        :
                                        <tr className="bg-gray-100">
                                            <td className="border px-4 py-2 text-center">{created_trade.id}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.buying_party}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.selling_party}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.product}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.underlying_price}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.quantity}</td>
                                            <td className="border px-4 py-2 text-center">{created_trade.strike_price}</td>
                                            <td  className="border px-4 py-2 text-center">{created_trade.underlying_currency} | {created_trade.notional_currency}</td>
                                            <td className="border px-4 py-2 text-center">{moment(created_trade.maturity_date).fromNow()}</td>
                                            <td className="border px-4 py-2 text-center">{moment(created_trade.date).fromNow()}</td>
                                            <td className="border px-4 py-2">
                                                <Link className="mr-3 px-2 py-1 bg-blue-700 text-white rounded" to={`/trading/edit-trade/${created_trade.id}`}>Edit</Link>
                                                <Link className="ml-3 px-2 py-1 bg-red-700 text-white rounded" to={`/trading/delete-trade/${created_trade.id}`}>Delete</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        }           
                    </section>
                    
                    <section className="mt-12" id="edited-trades">
                        <h3 className="text-brand font-semibold text-lg">Edited Trades</h3>
                        <p>Trades which the user has edited on this day, with a description of each edit</p>

                        <div className="mt-3">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {reportData.edited_trades.map((edited_trade, index)=> (
                                    <div className="bg-white rounded shadow p-4 mb-3" key={index}>
                                        <div className="">
                                            <h5 className="text-brand font-bold">{edited_trade.trade.id}</h5>
                                            <p>Edits: {edited_trade.num_of_edits}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
    
                    <section className="mt-12" id="deleted-trades">
                        <h3 className="text-brand font-semibold text-lg">Deleted Trades</h3>
                        <p>Trades which a user has deleted on this daye</p>
                    </section>
    
                    <section className="mt-12" id="erroneous-trades">
                        <h3 className="text-brand font-semibold text-lg">Erroneous Trades</h3>
                        <p>Trades identified to have erroneous data</p>
                    </section>
    
                    <section className="mt-12" id="user-corrected-trades">
                        <h3 className="text-brand font-semibold text-lg">User Corrections</h3>
                        <p>Trades which have bheen identified to be erroneous by the system and the user has edited them</p>
                    </section>
    
                    <section className="mt-12" id="system-corrected-trades">
                        <h3 className="text-brand font-semibold text-lg">System Corrections</h3>
                        <p>Trades which have erroneous data which the system has identified and corrected automatically</p>
                    </section>
            </div>
        );
    }

}